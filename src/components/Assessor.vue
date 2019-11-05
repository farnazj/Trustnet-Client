<template>

  <div :class="['c100', valuePercentage, valueColor ,{transitive: isTransitive}]">
      <span>
        <custom-avatar :user="user" :clickEnabled="true"></custom-avatar>
      </span>

      <div class="slice">
        <div class="bar"></div>
        <div class="fill"></div>
      </div>
  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    isTransitive: {
      type: Boolean
    },
    credibilityValue: {
      type: Number
    }
  },
  data: () => {
    return {

    }
  },
  computed: {
    valueColor: function() {
      if (this.credibilityValue < 0)
        return 'red lighten-2';
      // else if (this.credibilityValue == 0)
      //   return 'orange darken-1';
      else if (this.credibilityValue > 0)
        return 'green darken-1';
    },
    valuePercentage: function() {
      let percentage = Math.abs(Math.round(this.credibilityValue * 100));
      return 'p' + percentage;
    }
  }

}
</script>

<style lang="stylus" scoped>

transition-property(n)
  -webkit-transition-property: n
  -moz-transition-property: n
  -o-transition-property: n
  transition-property: n

transition-duration(n)
  -webkit-transition-duration: n
  -moz-transition-duration: n
  -o-transition-duration: n
  transition-duration: n

transition-timing-function(fn)
  -webkit-transition-timing-function: fn
  -moz-transition-timing-function: fn
  -o-transition-timing-function: fn
  transition-timing-function: fn

rotate-transform(n)
  -webkit-transform: rotate(n);
  -moz-transform: rotate(n);
  -ms-transform: rotate(n);
  -o-transform: rotate(n);
  transform: rotate(n);

box-sizing(n)
  -webkit-box-sizing: n
  -moz-box-sizing: n
  box-sizing: n

// VARS
$circle-width =0.13em
$circle-width-hover= 0.13em;

// colors default
$primary-color= #000000; // czarny
$secondary-color= #dfe8ed; //szary bcg
$bg-color= #ffffff; //srodkowy bezowy

// colors customized

$primary-color-green= #43A047;
$primary-color-red= #E57373;
$primary-color-orange= #FB8C00;
$primary-color-span= #3c4761;
$background-grey= #d2dbe0;

// CIRCLE
// classes 2 extend
.rect-auto{
	clip: rect(auto, auto, auto, auto);
}

.pie {
	position: absolute;
	border: $circle-width solid $primary-color;
	width: 1 - (2 * $circle-width);
	height: 1 - (2 * $circle-width);
	clip: rect(0em, 0.5em, 1em, 0em);
	border-radius: 50%;
	rotate-transform(0deg);
}

.pie-fill {
	rotate-transform(180deg);
}
/* .wrapper {
  width: 1200px;
  margin: 0 auto;
} */

.green.darken-1, .red.lighten-2 {
    background-color: $background-grey !important;
    border-color: $background-grey !important;
}


// main
.c100 {

	*, *:before, *:after {
		box-sizing(content-box);
	}

	position: relative;
	font-size: 45px;
	width: 1em;
	height: 1em;
	border-radius: 50%;
	float: left;
	-margin: 0.4em;
  background-color: $background-grey !important;

// 	// center circle to its parent
// 	&.center{
// 		float: none;
// 		margin: 0 auto;
// 	}

// 	&.small{
// 		font-size: 80px;
// 	}

	// centered value inside circle
	> span {
		position: absolute;
		width: 100%;
		z-index: 1;
		left: 0;
		top: 0;
		width: 5em;
		line-height: 5em;
		font-size: 0.2em;
		color: $primary-color-span;
		display: block;
		text-align: center;
		white-space: nowrap;
		transition-property(all);
		transition-duration(0.2s);
		transition-timing-function(ease-out);
	}

	// background inside the circle
	&:after{
		position: absolute;
		top: $circle-width;
		left: $circle-width;
		display: block;
		content: " ";
		border-radius: 50%;
		background-color: $bg-color;
		width: 1 - (2 * $circle-width);
		height: 1 - (2 * $circle-width);
		transition-property(all);
		transition-duration(0.2s);
		transition-timing-function(ease-in);

	}

	// the slice (mask)
	.slice {
		position: absolute;
		width: 1em;
		height: 1em;
		clip: rect(0em, 1em, 1em, 0.5em);
	}

	// circle to show the status
	.bar {
		@extend .pie;
	}


	// loop to create all needed elements automatically
	for j in (51..100) {

		&.p{j} .slice {
			@extend .rect-auto;
		}

		&.p{j} .bar:after{
			@extend .pie-fill;
		}

		&.p{j} .fill{
			@extend .pie;
			@extend .pie-fill;
		}

	}

	// loop to rotate all 100 circles
	for j in (1..100) {
		&.p{j} .bar {
			rotate-transform((360/100*j) deg);
		}
	}


	// hover styles
	/* &:hover{

		cursor: default;

		> span {
			width: 3.33em;
			line-height: 3.33em;
			font-size: 0.3em;
			color: $primary-color-span;
		}

		&:after{
			top: $circle-width-hover;
			left: $circle-width-hover;
			width: 1 - (2 * $circle-width-hover);
			height: 1 - (2 * $circle-width-hover);
		}

	} */


	// red skin
	&.red{

		.bar, .fill { border-color: $primary-color-red !important;}

		&:hover{
			> span { color: $primary-color-span;}
		}

	}


	// green skin
	&.green{

		.bar, .fill { border-color: $primary-color-green !important;}

		&:hover{
			> span { color: $primary-color-span;}
		}

	}


	// orange skin
	&.orange{

		.bar, .fill { border-color: $primary-color-orange !important;}

		&:hover{
			> span { color: $primary-color-span;}
		}

	}

}

</style>
