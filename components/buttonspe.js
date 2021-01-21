export default {
	name: "ButtonSpe",
	props: ['methodname', 'text'],
	template: `
		<div class="btn" @click="methodname.call($parent)">{{text}}</div>
	`,
}