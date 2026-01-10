<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <v-img
                    class="my-3"
                    cover
                    height="200"
                    :src="require('../assets/logo.svg')"
                />
            </v-col>

            <v-col class="mb-4">
                <h1 class="text-h3 font-weight-bold mb-3">
                    Welcome to Vuetify
                </h1>

                <p class="text-subtitle-1 font-weight-regular">
                    For help and collaboration with other Vuetify developers,
                    <br />please join our online
                    <a href="https://community.vuetifyjs.com" target="_blank"
                        >Discord Community</a
                    >
                </p>
            </v-col>

            <v-col class="mb-5" cols="12">
                <h2 class="text-h5 font-weight-bold mb-3">What's next?</h2>

                <v-row justify="center">
                    <a
                        v-for="(next, i) in whatsNext"
                        :key="i"
                        class="text-subtitle-1 mx-3"
                        :href="next.href"
                        target="_blank"
                    >
                        {{ next.text }}
                    </a>
                </v-row>
            </v-col>

            <v-col class="mb-5" cols="12">
                <h2 class="text-h5 font-weight-bold mb-3">Important Links</h2>

                <v-row justify="center">
                    <a
                        v-for="(link, i) in importantLinks"
                        :key="i"
                        class="text-subtitle-1 mx-3"
                        :href="link.href"
                        target="_blank"
                    >
                        {{ link.text }}
                    </a>
                </v-row>
            </v-col>

            <v-col class="mb-5" cols="12">
                <h2 class="text-h5 font-weight-bold mb-3">Ecosystem</h2>

                <v-row justify="center">
                    <a
                        v-for="(eco, i) in ecosystem"
                        :key="i"
                        class="text-subtitle-1 mx-3"
                        :href="eco.href"
                        target="_blank"
                    >
                        {{ eco.text }}
                    </a>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'HelloWorld',

    data: () => ({
        ecosystem: [
            {
                text: 'vuetify-loader',
                href: 'https://github.com/vuetifyjs/vuetify-loader',
            },
            {
                text: 'github',
                href: 'https://github.com/vuetifyjs/vuetify',
            },
            {
                text: 'awesome-vuetify',
                href: 'https://github.com/vuetifyjs/awesome-vuetify',
            },
        ],
        importantLinks: [
            {
                text: 'Documentation',
                href: 'https://vuetifyjs.com',
            },
            {
                text: 'Chat',
                href: 'https://community.vuetifyjs.com',
            },
            {
                text: 'Made with Vuetify',
                href: 'https://madewithvuejs.com/vuetify',
            },
            {
                text: 'Twitter',
                href: 'https://twitter.com/vuetifyjs',
            },
            {
                text: 'Articles',
                href: 'https://medium.com/vuetify',
            },
        ],
        whatsNext: [
            {
                text: 'Explore components',
                href: 'https://vuetifyjs.com/components/api-explorer',
            },
            {
                text: 'Select a layout',
                href: 'https://vuetifyjs.com/layout/pre-defined',
            },
            {
                text: 'Frequently Asked Questions',
                href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
            },
        ],
    }),
}
</script>
