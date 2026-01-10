<template>
    <v-app>
        <v-app-bar density="compact">
            <v-toolbar-title class="text-h5">
                <span>Kulmi</span>
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
    data: () => ({}),
    methods: {
        getCurrentRoute() {
            return this.$route.path
        },
    },
}
</script>
