class Line{
    contstructor(el,binding) {
        this.el = el;
        this.binding = binding;
        this.index = binding.value.index;
        this.vue = this.binding.value.vue;

        this.setLine();
    }
    setLine(){
        this.el.addEventListener('mousedown', start.bind(this), false);

        function start(event) {
            console.log(1)
            event.preventDefault();
        }
    }
}

export default Line;