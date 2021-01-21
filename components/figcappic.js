export default {
	name: "FigCapPic",
	props: ['strip', 'index'],
	template: `
		<figure>
			<a class="img-preview" :href="strip.img" :title="strip.title + ' - strip n°' + strip.num + ' - ' + strip.year" @click.prevent="showImage(strip, index)">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<img :src="strip.img" :alt="strip.title + ' - strip n°' + strip.num + ' - ' + strip.year" />
			</a>
			<figcaption>
				{{strip.title}} - strip n°{{strip.num}} - {{strip.year}}
			</figcaption>
		</figure>
	`,
	methods: {
		showImage(strip, index = null){
			this.$parent.showImage(strip, index);
		}
	}
}