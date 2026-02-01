<template>
    <v-app>
        <v-app-bar density="compact">
            <v-toolbar-title class="text-h5">
                <span
                @click="clearCanvas()">
                    Kulmi
                </span>
                <sub
                    style="
                        margin-left: 5px;
                        font-style: normal;
                        font-size: 0.8rem;
                    "
                    @click="throwRandomCards()"
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

        <canvas id="canvas"></canvas>
    </v-app>
</template>

<script>
import { VTabsWindow } from 'vuetify/components';

export default {
    name: 'App',
    data: () => ({
        version: import.meta.env.VITE_APP_VERSION,
        cardInfo: {
            image: '',
            particles: [],
            dpr: null,
            canvas: null,
            context: null,
            id: null,
            width: null,
            height: null,
            cwidth: null,
            cheight: null,
            cwidthhalf: null,
			cheighthalf: null,
            animate: false,
        }
    }),
    mounted() {
        import('./cards.js').then((module) => {
        var image = document.createElement( 'img' );
        image.src = module.cards();
        this.cardInfo.image = image

        this.cardInfo.dpr = window.devicePixelRatio;
        
        this.clearCanvas();
        
        this.cardInfo.context = canvas.getContext( '2d' );

        this.cardInfo.id = 35;

        this.cardInfo.width = 54;
        this.cardInfo.height = 96;

        this.cardInfo.cwidth = this.cardInfo.width * Math.round( this.cardInfo.dpr );
        this.cardInfo.cheight = this.cardInfo.height * Math.round( this.cardInfo.dpr );
        
        this.cardInfo.cwidthhalf = this.cardInfo.cwidth / 2;
        this.cardInfo.cheighthalf = this.cardInfo.cheight / 2;

        });
        },
    methods: {
        getCurrentRoute() {
            return this.$route.path
        },
        clearCanvas(){
            this.cardInfo.animate = false;
            this.cardInfo.particles = [];

            var canvas = document.getElementById( 'canvas' );
		    canvas.style.width = '100%';
			canvas.style.height = '100%';
            // make sure to keep this order of commands in order to work for mobile
            canvas.width = window.innerWidth * this.cardInfo.dpr;
			canvas.height = window.innerHeight * this.cardInfo.dpr;
            canvas.style.zIndex = -1;
            this.cardInfo.canvas = canvas;
        },
        throwRandomCards()
        {
            if(this.cardInfo.animate == false)
            {
                this.cardInfo.animate = true;
                requestAnimationFrame( this.animate );
            }

            let count = Math.floor(Math.random() * 3) + 1;
            for(let i = 0; i < count; i++)
            {
                let partialWidth = Math.floor(this.cardInfo.canvas.width / 5);
                let x = Math.floor(Math.random()*partialWidth*3) + partialWidth;
                let partialHeight = Math.floor(this.cardInfo.canvas.height / 3);
                let y = Math.floor(Math.random()*partialHeight);
                this.throwCard(x, y)
            }
        },
        throwCard( x, y ) {
            function Particle( id, x, y, sx, sy, outerContext ) {

				if ( sx === 0 ) sx = 2;

				var cx = ( id % 4 ) * outerContext.cardInfo.width;
				var cy = Math.floor( id / 4 ) * outerContext.cardInfo.height;

				this.update = function () {

					x += sx;
					y += sy;

					if ( x < ( - outerContext.cardInfo.cwidthhalf ) || x > ( outerContext.cardInfo.canvas.width + outerContext.cardInfo.cwidthhalf ) ) {

						var index =outerContext.cardInfo. particles.indexOf( this );
						outerContext.cardInfo.particles.splice( index, 1 );

						return false;

					}

					if ( y > outerContext.cardInfo.canvas.height - outerContext.cardInfo.cheighthalf ) {

						y = outerContext.cardInfo.canvas.height - outerContext.cardInfo.cheighthalf;
						sy = - sy * 0.85;

					}

					sy += 0.85;

					outerContext.cardInfo.context.drawImage( outerContext.cardInfo.image, cx, cy, outerContext.cardInfo.width, 
                    outerContext.cardInfo.height, 
					Math.floor( x - outerContext.cardInfo.cwidthhalf ), 
					Math.floor( y - outerContext.cardInfo.cheighthalf ), 
					outerContext.cardInfo.cwidth, outerContext.cardInfo.cheight );

					return true;

				}
            }

        // inital throw
        this.cardInfo.canvas.style.zIndex = 1000;
        let id = Math.floor(Math.random() * 36)

        var particle = new Particle( id, x, y, 
        Math.floor( Math.random() * 6 - 3 ) * 2, 
        - Math.random() * 16, 
        this );
        this.cardInfo.particles.push( particle );
        }, 
        animate() {
                if (this.cardInfo.animate)
                                {
				var i = 0, l = this.cardInfo.particles.length;

				while ( i < l ) {
					this.cardInfo.particles[ i ].update() ? i ++ : l --;

				}
                 requestAnimationFrame( this.animate );
                }  
		},
    },
}
</script>
