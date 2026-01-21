<template src="./landingScreen.html"></template>
<script>
export default {
    data: () => ({
        jaesse: [],
        player1: '',
        player2: '',
        player3: '',
        player4: '',
        sTeam1: '',
        sTeam2: '',
    }),
    mounted() {
        const storedKeys = localStorage.getItem('jaesse')
        if (storedKeys) {
            try {
                const jaesse = JSON.parse(localStorage.getItem('jaesse'))
                this.jaesse = jaesse
                    .filter((a) => localStorage.getItem(a) !== null)
                    .sort((a, b) => b.localeCompare(a))
                localStorage.setItem('jaesse', JSON.stringify(this.jaesse))
            } catch {
                // localStorage.removeItem('jaesse')
            }
        }
        if (this.$route.name == 'revanche') {
            this.playRevanche()
        }
    },
    methods: {
        startJass() {
            if (
                this.player1 !== '' &&
                this.player2 !== '' &&
                this.player3 !== '' &&
                this.player4 !== ''
            ) {
                this.sTeam1 =
                    this.player1.slice(0, 2) + this.player2.slice(0, 2)
                this.sTeam2 =
                    this.player3.slice(0, 2) + this.player4.slice(0, 2)
                const date = new Date()
                const newId =
                    this.getDate() + '_' + this.sTeam1 + '_vs_' + this.sTeam2
                console.log(newId)
                this.jaesse.push(newId)
                this.jaesse.sort((a, b) => b.localeCompare(a))
                localStorage.setItem('jaesse', JSON.stringify(this.jaesse))
                this.createNewJass(
                    newId,
                    this.player1,
                    this.player2,
                    this.player3,
                    this.player4,
                    this.sTeam1,
                    this.sTeam2,
                    date.toJSON().slice(0, 10)
                )

                this.$router.push({
                    name: 'jass',
                })
            }
        },
        getDate() {
            const date = new Date()
            const dateString =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                '_' +
                date.getHours() +
                ':' +
                date.getMinutes()
            return dateString
        },
        openJass(jass) {
            const jassDetails = JSON.parse(localStorage.getItem(jass))
            if (jassDetails !== null) {
                localStorage.setItem('currentJass', jass)
                this.$router.push({ name: 'jass' })
            }
        },
        createNewJass(
            newId,
            player1,
            player2,
            player3,
            player4,
            sTeam1,
            sTeam2,
            date
        ) {
            localStorage.setItem(
                newId,
                JSON.stringify({
                    team1: {
                        player1: player1,
                        player2: player2,
                        sTeam: sTeam1,
                    },
                    team2: {
                        player1: player3,
                        player2: player4,
                        sTeam: sTeam2,
                    },
                    date: date,
                })
            )
            localStorage.setItem('currentJass', newId)
        },
        playRevanche() {
            const prevJassId = localStorage.getItem('currentJass')

            if (prevJassId === null) {
                localStorage.removeItem('currentJass')
                this.$router.replace({ name: 'home' })
                return
            }

            let prevDetails

            try {
                prevDetails = JSON.parse(localStorage.getItem(prevJassId))
            } catch {
                // TODO: what to do in this case?
                localStorage.removeItem('currentJass')
                this.$router.replace({ name: 'home' })
                return
            }

            let finished = false

            try {
                finished = prevDetails.rounds && prevDetails.rounds.length == 18
            } catch {}

            if (finished) {
                const date = new Date()
                const newId =
                    this.getDate() +
                    '_' +
                    prevDetails.team1.sTeam +
                    '_vs_' +
                    prevDetails.team2.sTeam
                this.jaesse.push(newId)
                this.jaesse.sort((a, b) => b.localeCompare(a))
                localStorage.setItem('jaesse', JSON.stringify(this.jaesse))
                this.createNewJass(
                    newId,
                    prevDetails.team1.player1,
                    prevDetails.team1.player2,
                    prevDetails.team2.player1,
                    prevDetails.team2.player2,
                    prevDetails.team1.sTeam,
                    prevDetails.team2.sTeam,
                    date.toJSON().slice(0, 10)
                )
                this.$router.push({
                    name: 'jass',
                })
            } else {
                this.$router.replace({ name: 'home' })
            }
        },
    },
}
</script>

<style src="./style.css"></style>
