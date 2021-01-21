// Import component for strips
import FigCapPic from '../components/figcappic.js';
import ButtonSpe from '../components/buttonspe.js';

// Import masonry for gallery
let VueMasonryPlugin = window["vue-masonry-plugin"].VueMasonryPlugin;
Vue.use(VueMasonryPlugin);

let app = new Vue({
    el: '#stripapp',
	components: {
		'figcappic' : FigCapPic,
		'buttonspe' : ButtonSpe,
	},
    data: {
        showLoaderDay: true,
        showLoaderGallery: true,
        showLoaderSingle: false,
        errorMessage: '',
        activeTab: 'stripOfDay',
        stripOfDay: {"num": 612, "year": "2009", "safe_title": "Estimation", "img": "https://imgs.xkcd.com/comics/estimation.png", "title": "Estimation"},
        number: '',
        stripOfNumber: '',
        listStrip: Array(),
        offset: 6,
        currentNumberGallery:0,
        modalStrip: '',

        // Url (https://cors-anywhere.herokuapp.com/) to get rid of cors trouble
        // otherwise, we need to install a middleware to put 'Access-Control-Allow-Origin' in headers response
        urlRootXkcd: 'https://cors-anywhere.herokuapp.com/https://xkcd.com/',
    },
    created: function(){
        // Get the strip of the day
        this.getStripOfTheDay();

        // To limit access of the API, we put a debounce
        this.debouncedGetStripByNumber = _.debounce(this.getStripByNumber, 500);
    },
    watch:{
        // Every time number change, we pick the strip
        number: function (newNumber, oldNumber) {
            this.debouncedGetStripByNumber();
        }
    },
    methods:{

		// Method to show modal with the strip
        showImage: function(strip, index = null){
            this.modalStrip = strip;
			this.modalStrip.index = index;
			$('body').css({
			  'overflow': 'hidden',
			});
        },
		prevStrip: function(index){
		
			// Check if index is still inferior to last published strip
			if(index < this.stripOfDay.num){
				let prevStrip = this.findStripInList(index+1);
				this.modalStrip = prevStrip.strip;
				this.modalStrip.index = prevStrip.id;
			}
		},
		nextStrip: function(index){

			let nextStrip = this.findStripInList(index-1);
			
			// If we have a next strip
			if( nextStrip !== undefined ){
				this.modalStrip = nextStrip.strip;
				this.modalStrip.index = nextStrip.id;
				
			} else{
				this.loadMoreStrips();
			}
		},
		
		// Find strip by their number in list
		findStripInList: function(index){
			let result = this.listStrip.filter(strip => {
				if(strip.id == index){
					return strip;
				}
			});
			
			if(result.length > 0){
				return result[0];
			}
		},

		// Method to close the modal
        closeLightbox: function(){
            this.modalStrip = '';
			$('body').css({
			  'overflow': 'visible',
			});
        },

		// Change tab
        changeTab: function(tabSelected){
            this.activeTab = tabSelected;
        },

		// Remove enter submission on input
        handleEnter: function(event){
            
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        },

        getStripOfTheDay: function(){
            let url = this.urlRootXkcd + 'info.0.json';

            // Axios method to get json from XKCD
            this.axiosMethod(url, 'stripOfDay');
        },

        getStripByNumber: function(){
            let url = this.urlRootXkcd + this.number + '/info.0.json';

            // Axios method to get json from XKCD
            this.axiosMethod(url, 'stripOfNumber');
        },
		
		// To pick a random strip between current and first strip
		randomStrip: function(){
			this.number = Math.floor(Math.random() * (this.stripOfDay.num) + 1);
            let url = this.urlRootXkcd + this.number + '/info.0.json';

            // Axios method to get json from XKCD
            this.axiosMethod(url, 'stripOfNumber');
        },

		// Initialization of gallery
        initGallery: function(){
            let numberGallery = this.stripOfDay.num;
            this.currentNumberGallery = this.stripOfDay.num;

            this.loadStrips(numberGallery);
        },

		// Method to load more strips
        loadMoreStrips: function(){
            let numberGallery = this.currentNumberGallery - 1;

            this.loadStrips(numberGallery);
        },

		// Load strips for gallery
        loadStrips: function(numberGallery){
            let self = this;
            let endStep = this.currentNumberGallery - this.offset;

            self.showLoaderGallery = true;

            // Load offset more strip from currentNumber
            for(numberGallery; numberGallery > endStep; numberGallery--){

                let url = this.urlRootXkcd + numberGallery + '/info.0.json';

                // Axios to get json from XKCD
                axios({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-type': 'application/json',
                    }
                }).then(function (response) {

					self.listStrip.push({id: response.data.num, strip: response.data});					

					self.showLoaderGallery = false;

                }).catch(function (error) {
                });

                this.currentNumberGallery = numberGallery;
            }
        },

        axiosMethod: function(url, stripToStore){
            let self = this;

			// Handle loaders
			if(stripToStore == 'stripOfDay'){
				self.showLoaderDay = true;

			} else if(stripToStore == 'stripOfNumber'){
				self.showLoaderSingle = true;
			}
			
            this.errorMessage = '';
			
            // Reset strip when searching another one
            if(stripToStore == 'stripOfNumber'){
                this.stripOfNumber = '';
            }

            // Axios to get json from XKCD
            axios({
                method: 'GET',
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-type': 'application/json',
                }
            }).then(function (response) {

                if(stripToStore == 'stripOfDay'){
                    self.stripOfDay = response.data;

                    // Create gallery
                    self.initGallery();
					
					self.showLoaderDay = false;

                } else if(stripToStore == 'stripOfNumber'){
                    self.stripOfNumber = response.data;
					
					self.showLoaderSingle = false;
                }

            }).catch(function (error) {
                self.errorMessage = 'Are you sure this strip exist ?';
            });
        }
    }
});