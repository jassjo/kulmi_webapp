<template>
    <v-app>
        <v-app-bar density="compact">
            <v-toolbar-title class="text-h5">
                <span>Kulmi</span>
                <sub
                    style="
                        margin-left: 5px;
                        font-style: normal;
                        font-size: 0.8rem;
                    "
                >
                    {{ version }}
                </sub>
            </v-toolbar-title>
            <v-app-bar-nav-icon
                v-if="getCurrentRoute() != '/'"
                size="medium"
                class="pr-3"
            >
                <router-link tag="div" to="/">
                    <v-icon> mdi-home </v-icon>
                </router-link>
            </v-app-bar-nav-icon>
        </v-app-bar>

        <v-main>
            <router-view no-gutters />
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data: () => ({
        version: import.meta.env.VITE_APP_VERSION,
    }),
    methods: {
        getCurrentRoute() {
            return this.$route.path
        },
    },
}
</script>
