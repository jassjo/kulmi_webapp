<template src="./submitForm.html"></template>
<script>
export default {
    // TODO: also preserve form input before submission (e.g. user navigates away and comes back later)
    // TODO: use validation rules for form inputs
    // TODO: add loading animation when fetching players
    // TODO: add interface to create new player
    data: () => ({
        apiKey: '',
        showApiKey: false,
        loading: false,
        submitButtonText: 'Jass an Statistik senden',
        submitButtonColor: 'success',
        errorMessage: '',
        showError: false,
        date: '',
        state: {
            team1: {
                player1: '',
                player2: '',
                sTeam: '',
            },
            team2: {
                player1: '',
                player2: '',
                sTeam: '',
                points: 0,
                wies: 0,
            },
            date: '',
            result: {
                points1: 0,
                wies1: 0,
                total1: 0,
                points2: 0,
                wies2: 0,
                total2: 0,
            },
            submittedId: null,
            submission: null,
        },
        allPlayers: [],
        submission: {
            player_id_a_1: null,
            player_id_a_2: null,
            player_id_b_1: null,
            player_id_b_2: null,
            date: null,
            note: null,
            points_a: null,
            points_b: null,
            weis_a: null,
            weis_b: null,
        },
        player_db_info: '',
    }),
    async mounted() {
        const storedApiKey = localStorage.getItem('jassApiKey')
        if (storedApiKey !== null && this.apiKey === '') {
            this.apiKey = atob(storedApiKey)
        }

        if (this.apiKey && this.apiKey !== '') {
            await this.readAllPlayersFromStore()
        }

        // TODO: can this code be moved somewhere else to re-use it
        // e.g. KulmiGrid also uses (parts of) this logic
        const jassId = localStorage.getItem('currentJass')

        if (jassId === null) {
            localStorage.removeItem('currentJass')
            this.$router.replace({ name: 'home' })
            return
        }
        this.jassId = jassId

        /* load existing state if possible */
        let state
        try {
            state = JSON.parse(localStorage.getItem(jassId))
        } catch {
            // to prevent data-loss to not remove this item here,
            // manual reconstruction of corrupted data might be necessary
            // localStorage.removeItem(jassId)
            this.$router.replace({ name: 'home' })
            return
        }
        if (state === null) {
            // to prevent data-loss to not remove this item here,
            // manual reconstruction of corrupted data might be necessary
            // localStorage.removeItem(jassId)
            this.$router.replace({ name: 'home' })
            return
        }

        if (typeof state.rounds === 'undefined') {
            state.rounds = []
        }

        this.state = state

        if (this.state.submittedId && this.state.submission) {
            // load existing successful submission
            this.submission = this.state.submission
            this.date =
                this.state.submission.date.substr(6, 4) +
                '-' +
                this.state.submission.date.substr(3, 2) +
                '-' +
                this.state.submission.date.substr(0, 2)
        } else {
            // pre-fill form and submission with values derived from jass
            this.date = new Date(this.state.date)
            this.submission.date = this.state.date
            this.submission.points_a = this.state.result.total1
            this.submission.points_b = this.state.result.total2
            this.submission.weis_a = this.state.result.wies1
            this.submission.weis_b = this.state.result.wies2
        }

        if (!this.state.submittedId) {
            this.state.submittedId = 0
        } else if (this.state.submittedId > 0) {
            this.submitButtonText =
                'Jass bereits eingetragen (' + this.state.submittedId + ')'
        }

        if (
            this.allPlayers.length == 0 ||
            localStorage.getItem('lastFetch') < new Date().getTime()
        ) {
            this.fetchPlayers(import.meta.env.VITE_API_URL_PLAYERS)
        }
    },
    methods: {
        backToResult() {
            this.$router.push({
                name: 'jass',
            })
        },
        saveApiKey() {
            if (this.apiKey && this.apiKey !== '') {
                localStorage.setItem('jassApiKey', btoa(this.apiKey))
                localStorage.removeItem('allPlayers')
                this.fetchPlayers(import.meta.env.VITE_API_URL_PLAYERS)
            }
        },
        deleteApiKey() {
            localStorage.removeItem('jassApiKey')
            localStorage.removeItem('allPlayers')
            localStorage.removeItem('lastFetch')
            this.allPlayers = []
            this.player_db_info = this.allPlayers.length + ' geladen'
            this.apiKey = ''
        },
        async fetchPlayers(url) {
            // TODO: re-fetch in case initial fetch fails
            try {
                const params = {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'omit',
                    headers: {
                        Authorization: 'Bearer ' + this.apiKey,
                        Accept: 'application/json',
                    },
                }
                const response = await fetch(url, params)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                let result = await response.json()

                const players = result.data.map((o) => {
                    return { name: o.first_name + ' ' + o.last_name, id: o.id }
                })

                this.allPlayers = [
                    ...new Map(
                        this.allPlayers
                            .concat(Array.from(players))
                            .map((player) => [player['id'], player])
                    ).values(),
                ]

                this.player_db_info = this.allPlayers.length + ' geladen'

                const urlParams = new Proxy(
                    new URLSearchParams(result.links.last.split('?')[1]),
                    {
                        get: (searchParams, prop) => searchParams.get(prop),
                    }
                )
                const lastPage = urlParams.page
                let urlsToFetch = []

                for (var i = 2; i <= lastPage; i++) {
                    urlsToFetch.push(url + `?page=${i}`)
                }

                const promises = urlsToFetch.map((url) =>
                    fetch(url, params)
                        .then((response) => {
                            if (!response.ok) {
                                return Promise.reject(response)
                            }
                            return response.json()
                        })
                        .then((responseJson) => {
                            return Array.from(responseJson.data).map(
                                (player) => {
                                    return {
                                        name:
                                            player.first_name +
                                            ' ' +
                                            player.last_name,
                                        id: player.id,
                                    }
                                }
                            )
                        })
                        .catch((error) => {
                            console.log('Fetch error')
                            console.log(error)
                            this.showError = true
                            this.errorMessage = JSON.stringify(error)
                        })
                )

                const data = await Promise.all(promises)
                console.log(this.allPlayers)
                console.log(data.flat(1))

                this.allPlayers = [
                    ...new Map(
                        this.allPlayers
                            .concat(data.flat(1))
                            .map((player) => [player['id'], player])
                    ).values(),
                ]

                console.log(this.allPlayers)

                localStorage.setItem(
                    'lastFetch',
                    new Date().getTime() + 86400 * 1000
                )

                this.storeAllPlayers()
            } catch (error) {
                console.log(error)
                console.error(error.message)
                this.showError = true
                this.errorMessage = error.message
            } finally {
                this.player_db_info = this.allPlayers.length + ' geladen'
                console.log(this.allPlayers)
            }
        },
        saveJass() {
            this.loading = true
            const url = import.meta.env.VITE_API_URL_JASS

            // TODO: improve date handling all over the place
            this.submission.date = this.date.toJSON().slice(0, 10)
            this.submission.date =
                this.submission.date.substr(8, 2) +
                '-' +
                this.submission.date.substr(5, 2) +
                '-' +
                this.submission.date.substr(0, 4)

            fetch(url, {
                method: 'POST',
                withCredentials: true,
                credentials: 'omit',
                headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(this.submission),
            })
                .then((response) => {
                    if (!response.ok) {
                        return Promise.reject(response)
                    }
                    return response.json()
                })
                .then((responseJson) => {
                    const submittedId = responseJson.data.id
                    if (submittedId && submittedId > 0) {
                        this.state.submittedId = submittedId
                        this.state.submission = this.submission
                        localStorage.setItem(
                            this.jassId,
                            JSON.stringify(this.state)
                        )
                        this.errorMessage = ''
                        this.showError = false
                        this.loading = false
                        this.submitButtonColor = 'success'
                        this.submitButtonText =
                            'Jass erfolgreich gespeichert (' +
                            this.state.submittedId +
                            ')'
                    }
                })
                .catch((error) => {
                    let errorMsg = error.status + ' ' + error.statusText
                    if (typeof error.json === 'function') {
                        error
                            .json()
                            .then((jsonError) => {
                                console.log('Json error from API')
                                console.log(jsonError)
                                this.errorMessage =
                                    errorMsg + ' - ' + JSON.stringify(jsonError)
                            })
                            .catch((genericError) => {
                                console.log('Generic error from API')
                                console.log(genericError.statusText)
                                this.errorMessage =
                                    errorMsg + ' - ' + genericError.statusText
                            })
                    } else {
                        console.log('Fetch error')
                        console.log(error)
                        this.errorMessage = errorMsg + ' ' + error
                    }
                    this.showError = true
                    this.showErrorSubmitButton(5000)
                })
        },
        showErrorSubmitButton(timeout) {
            this.loading = false
            this.submitButtonText = 'Fehler beim Speichern'
            this.submitButtonColor = 'error'
            setTimeout(() => {
                this.submitButtonText = 'Jass an Statistik senden'
                this.submitButtonColor = 'success'
            }, timeout)
        },
        storeAllPlayers() {
            if (this.apiKey && this.apiKey !== '') {
                const text = JSON.stringify(this.allPlayers)
                // TODO: encryption is somewhat useless here
                // is there a better solution to cache api response data
                // but not leak it in a semi-obvious way?
                this.encryptText(text, this.apiKey).then((value) =>
                    localStorage.setItem('allPlayers', JSON.stringify(value))
                )
            }
        },
        removeAllPlayersStore() {
            localStorage.removeItem('allPlayers')
        },
        async readAllPlayersFromStore() {
            try {
                let encObject = JSON.parse(localStorage.getItem('allPlayers'))
                if (encObject !== null) {
                    const value = await this.decryptText(encObject, this.apiKey)
                    const allPlayers = JSON.parse(value)
                    if (Array.isArray(allPlayers) && allPlayers.length > 0) {
                        this.allPlayers = allPlayers
                        this.player_db_info =
                            this.allPlayers.length + ' geladen'
                    }
                }
            } catch (c) {
                console.log(c)
                this.removeAllPlayersStore()
            }
        },
        // https://dev.to/eddiegulay/secure-text-encryption-and-decryption-with-vanilla-javascript-1c23
        arrayBufferToHex(buffer) {
            return [...new Uint8Array(buffer)]
                .map((byte) => byte.toString(16).padStart(2, '0'))
                .join('')
        },
        hexToArrayBuffer(hex) {
            const bytes = new Uint8Array(hex.length / 2)
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
            }
            return bytes.buffer
        },
        getCryptoKey(password) {
            const encoder = new TextEncoder()
            const keyMaterial = encoder.encode(password)
            return crypto.subtle.importKey(
                'raw',
                keyMaterial,
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            )
        },
        async deriveKey(password, salt) {
            const keyMaterial = await this.getCryptoKey(password)
            return crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            )
        },
        async encryptText(text, password) {
            const encoder = new TextEncoder()
            const salt = crypto.getRandomValues(new Uint8Array(16))
            const iv = crypto.getRandomValues(new Uint8Array(12))
            const key = await this.deriveKey(password, salt)

            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encoder.encode(text)
            )

            return {
                cipherText: this.arrayBufferToHex(encrypted),
                iv: this.arrayBufferToHex(iv),
                salt: this.arrayBufferToHex(salt),
            }
        },
        async decryptText(encryptedData, password) {
            const { cipherText, iv, salt } = encryptedData
            const key = await this.deriveKey(
                password,
                this.hexToArrayBuffer(salt)
            )

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: this.hexToArrayBuffer(iv) },
                key,
                this.hexToArrayBuffer(cipherText)
            )

            const decoder = new TextDecoder()
            return decoder.decode(decrypted)
        },
    },
}
</script>

<style src="./style.css"></style>
