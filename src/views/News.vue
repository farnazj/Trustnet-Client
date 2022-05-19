<template>

    <v-container fluid class="pt-12 px-0">
        <custom-toolbar></custom-toolbar>
        <main>
        <v-row no-gutters justify="center" >
            <v-col cols="12" md="6" class="px-3 pt-8" >
                <p class="subtitle-1 font-weight-medium">
                    We're recruiting participants for a study of two new misinformation-fighting tools we've developed.
                </p>
                <p class="body-1">
                    One is a <a href="./about/extension" target="_blank"> browser extension </a> that lets you assess any web page or social media post as accurate or inaccurate, or inquire about its accuracy. The content could be a news article, a tweet, a youtube video, a facebook meme, etc. Anyone who follows you and opens the page or comes across a link to it will see your assessment right there, helping them avoid being tricked by misinformation.
                </p>
                <p class="body-1">
                    The other <a href="./about/reheadline" target="_blank"> browser extension </a> lets you rewrite headines on news articles. Anyone who follows you and comes across the headline anywhere on the web (e.g., in their social media feed or the homepage of the news source), will see your suggested alternative headline (alongside the original). This extension lets you do something about sensationalist, misleading, or clickbaity headlines.
                </p>
                <p class="body-1">
                    The user study will involve you installing these browser extensions and using them for 2 weeks and would help us understand if you find the tools useful and what is missing from them. <br>
                    The study is expected to start the week of June 1st. <br>
                    At the study's conclusion, 4 participants will be chosen randomly via a raffle and will be awarded $100 each.
                </p>
                    
                <p class="body-1">
                    If you’d like to participate, please fill out <a href="https://mit.co1.qualtrics.com/jfe/form/SV_4ZrCPq16IKJ1goe" target="_blank">this form </a>. 
                </p>    

                 <p class="caption pt-3">
                    Farnaz Jahanbakhsh & David Karger <br>
                    MIT CSAIL
                </p>    
            </v-col>
            


        </v-row>
        </main>
    </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'

export default {
    components: {
        'custom-toolbar': customToolbar
    },
    data () {
        return {
        }
    },
    created() {
        document.querySelector('meta[property="og:type"]').setAttribute("content", 'article');

        document.querySelector('meta[property="og:description"]').setAttribute("content", "We're recruiting participants for a study of two new misinformation-fighting browser extensions we've developed. One lets you assess any page as accurate or inaccurate or ask about its accuracy. The other allows you to rewrite news headlines.");

        document.querySelector('meta[property="og:url"]').setAttribute("content", 'https://trustnet.csail.mit.edu/news');
        
    }

}
</script>
