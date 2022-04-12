<template>
  <v-container fluid class="pt-12 px-0">
    <custom-toolbar></custom-toolbar>


    <v-row no-gutters :class="[ {'frozen': !$vuetify.breakpoint.mdAndDown}]">
      <v-tabs centered dark icons-and-text  dense :vertical="$vuetify.breakpoint.mdAndDown ? false : true"
       background-color="grey darken-3" slider-color="lime lighten-4" v-model="tabs" >
        <v-tab href="#platform">
            {{siteName}} Platform
          </v-tab>

          <v-tab href="#extension">
            {{siteName}} Extension
          </v-tab>

          <v-tab href="#reheadline">
            Reheadline Extension
          </v-tab>

      </v-tabs>
    </v-row>

    <v-row no-gutters justify="center" class="pt-5">
      <v-col sm="12" lg="7" md="9">

        <v-tabs-items v-model="tabs">
            <v-tab-item value="platform">

              <about-card categoryType="general">
              <template v-slot:category>
                General
              </template>
              <template v-slot:title>
                What's cool about {{siteName}}?
              </template>
              <template v-slot:body>
                <p>
                  {{siteName}} is a news reading and sharing platform where you can follow different
                  news publishing media or your friends to see what they post, write posts of your own, or
                  share posts with those you think would be interested in knowing about them.
                </p>

                <p>
                  What's cool about {{siteName}} is that it empowers you to curate or filter your newsfeed
                  with the help of those you trust. Of course not everyone you follow is trustworthy
                  (like that one person you follow just so that you see firshand what they say or that
                  other person you became "friends" with, just because you had to). So on {{siteName}},
                  you can explicitly specify who you trust and then choose to see only those posts
                  that they have confirmed to be true or maybe the posts that they have refuted
                  and their reasons for doing so. If you feel adventurous, you can even choose to
                  see those posts that your trusted sources have disagreement on.
                </p>

                <p>
                  Of course, we know that you shouldn't have to mark someone as trustworthy
                  just to be polite. On {{siteName}}, no one other than you knows who you have marked as
                  trusted. This means that even the sources you have trusted will not have any idea
                  that you trust them. Similarly, you will not know who trusts you.
                </p>
              </template>
            </about-card>

            <about-card categoryType="general">
              <template v-slot:category>
                General
              </template>
              <template v-slot:title>
                What are sources?
              </template>
              <template v-slot:body>
                <p>
                  A source is any user or a news publishing feed on {{siteName}}. As a user
                  of the system, you are also a source of news. To see
                  what a source posts, you need to follow it. You can also trust a source
                  and use their assessments of posts to filter the posts on your newsfeed
                  down to for example, only those articles that have been confirmed by your
                  trusted source.
                </p>
                <p>
                  You may follow a source but not trust it. Or you may trust a source
                  but not follow it (because for example, you're not interested in
                  the posts that they write or share, only in their assessments).
                </p>
              </template>
            </about-card>

            <about-card categoryType="sources">
              <template v-slot:category>
                <v-icon>account_circle</v-icon> Sources
              </template>
              <template v-slot:title>
                What information can I see about other sources?
              </template>
              <template v-slot:body>
                <p>
                  You can see the followers of each source by going to their profile.
                </p>
                <p>
                  We don't however, actively show who a source follows; although this
                  information is not effectively private because if Alice follows
                  Bob, Alice will be shown in Bob's list of followers.
                </p>

                <p>
                  Trust relationships on the other hand, are private. If you trust a
                  source, neither that source nor anyone else will know that you trust
                  them.
                </p>
              </template>
            </about-card>

            <about-card categoryType="sources">
              <template v-slot:category>
                <v-icon>account_circle</v-icon> Sources
              </template>
              <template v-slot:title>
                How can I manage my relationship with other sources?
              </template>
              <template v-slot:body>
                <p>
                  You can click on <v-icon>fas fa-users</v-icon> at the
                  righthand side of the toolbar to go to the Sources page.
                  There, you can discover other sources that you might want to follow or
                  trust, make customized lists, and add sources to those lists.
                </p>

                <p>
                  The blue cards display sources that have one or more RSS feeds. {{siteName}} fetches 
                  their posts periodically. You can add such sources to the system by going to the <span class="font-italic">Add Feeds</span> tab.
                  The light lime cards are sources that are managed by individual users.
                </p>
              </template>
            </about-card>

            <about-card categoryType="home">
              <template v-slot:category>
                <v-icon>home</v-icon> Home
              </template>
              <template v-slot:title>
                How do the filters on the homepage work?
              </template>
              <template v-slot:body>
                <p>
                  On your homepage, at the lefthand side, you have access to 4
                  types of filters to tune your newsfeed:
                  
                  <ul class="mt-1">
                    <li>
                      <span class="font-weight-medium">Explore mode:</span> when turned on,
                      displays articles shared or posted by anyone in the system,
                       not just those you follow.
                    </li>
                    <li>
                      <span class="font-weight-medium">Seen Status:</span> articles on
                      your news feed that you have already scrolled past, or those that
                      you have not seen yet, or both.
                    </li>

                    <li>
                      <span class="font-weight-medium">Validty:</span> articles
                      that have been confirmed, refuted, or whose accuracy have
                      been questioned by your sources. Or those on whose accuracy
                      there is disagreement among your sources (debated articles).
                    </li>

                    <li>
                      <span class="font-weight-medium">Assessors:</span> Sources whose
                      assessments you want to be considered in filtering. These could
                      be those you follow, yourself, those you trust, or even specific
                      sources or lists of sources.
                    </li>
                  </ul>

                </p>
                <p>
                  All of the above filters work in conjuction with each other. For
                  example, to see the posts that you have not seen yet and that have
                  been confirmed by your trusted sources, you can select <v-icon>remove_red_eye</v-icon>
                  Seen Status <v-icon>arrow_right_alt</v-icon> Not Seen, <v-icon>gavel</v-icon>
                  Accuracy <v-icon>arrow_right_alt</v-icon> Confirmed, and
                  <v-icon>account_circle</v-icon> Assessors <v-icon>arrow_right_alt</v-icon> Trusted.
                </p>

                <p>
                  In addition, you can click on any number of tags that are displayed on
                  posts to only select the posts that have those tags. Tag filtering also works
                  in conjuction with the filters provided in the filter panel on the left side.
                </p>

                <p>
                  Unless you are in <span class="font-italic">Explore mode</span>, on your feed,
                  <span class="font-weight-bold"> you only see articles from those you follow</span>.
                  The filters on the filter panel are not for who posted or shared the posts, but rather
                  who assessed them and what their assessment was.
                </p>

              </template>
            </about-card>


             <about-card categoryType="posts">
              <template v-slot:category>
                <v-icon>note_add</v-icon> Posts
              </template>
              <template v-slot:title>
                How do I post?
              </template>
              <template v-slot:body>
                <p>
                  To write a post, you can click on the <v-icon>note_add</v-icon> icon on the app bar and write your
                  post in the <span class="font-italic">Create</span> tab. The post by default will be shared with anyone
                  who follows you. However, you can share it with only a specific set of sources by selecting a target audience.
                  A post that is created by you is automatically given an <span class="font-italic">accurate</span> assessment
                  by you. To change that assessment, once you have added the post, you can open the post and change the assessment
                  by clicking on the gavel icon, much like changing your assessment on any other post. You can also edit or delete
                  your post by opening it and clicking on the <v-icon>build</v-icon> icon.
                </p>

                <p>
                  To import a post or an article from another website, you can go to the <span class="font-italic">Import</span> tab in the same menu.
                </p>

              </template>
            </about-card>

          </v-tab-item>


          <v-tab-item value="extension">

            <about-card categoryType="general">
              <template v-slot:category>
                General
              </template>
              <template v-slot:title>
                What's cool about the {{siteName}} extension?
              </template>
              <template v-slot:body>
                <p>
                  The {{siteName}} extension lets you assess any content on the web right on the page where the content is and also enables you to see content assessments from those you trust. This has the potential to help you avoid being tricked by misinformation and empowers you to help the others in this regard.
                </p>

                <p>
                  With the {{siteName}} extension, you can assess any content that has a URL. This includes news articles, Youtube videos, tweets, Facebook posts, and so on.
                </p>

              </template>
            </about-card>

            <about-card categoryType="settings" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.settings}}</v-icon> Installation
              </template>
              <template v-slot:title>
                Installation
              </template>
              <template v-slot:body>
                <p>
                  Visit <a href="https://chrome.google.com/webstore/detail/trustnet/nphapibbiamgbhamgmfgdeiiekddoejo" target="_blank"> this link </a> and add the extension to your Chrome browser.
                </p>

                <p>
                Because the extension delivers customized assessments to you (i.e., the assessments of those you explicitly mark as trustworthy), you will need to log in. To log in, open a tab in your browser and navigate to any website, for example <a href="https://www.nytimes.com/" target="_blank">The New York Times</a>.
                </p>

                <p>
                  The login pane for the extension will open on the side of the page. Log in with your {{siteName}} credentials.
                </p>

                <v-row no-gutters justify="center">
                  <v-img :src="images('trustnetExtensionLogin')" contain max-width="150"></v-img>
                </v-row>
                
              </template>
            </about-card>
           
            <about-card categoryType="news" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.news}}</v-icon> News Articles
              </template>
              <template v-slot:title>
                Assessing news article
              </template>
              <template v-slot:body>
                <p>
                 To assess any piece of content using the {{siteName}} extension, you need to navigate to the page where the content is identified via its URL. For example, for assessing an article, you simply navigate to the article's page and assess it there, as shown here:
                </p>

                <v-img :src="images('assessingArticles')" contain max-width="500"></v-img>
                
              </template>
            </about-card>

            <about-card categoryType="twitter" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.twitter}}</v-icon> Tweets
              </template>
              <template v-slot:title>
                Assessing tweets
              </template>
              <template v-slot:body>
                <p>
                  For assessing an article that is embedded inside a tweet, you can simply navigate to the article's page and assess it. The assessments of the article will be displayed on the tweet.
                </p>
                <p>
                  If you would like to assess a tweet itself, you can click on it and navigate to the tweet's page and assess it there:
                </p>

                <v-img :src="images('assessingTweets')" contain max-width="500"></v-img>
                
                <p class="mt-4">
                  If you encounter a tweet that has been assessed, the assessment indicator will be placed next to the time the tweet was posted, as shown here:
                </p>

                <v-img :src="images('assessedTweets')" contain max-width="500"></v-img>

                <p class="mt-4">
                  This is because the accuracy icons for a piece of content are placed next to the link to that content and the posted time of a tweet is where the link to the tweet is contained.
                </p>
              </template>
            </about-card>

            <about-card categoryType="facebook" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.facebook}}</v-icon> Facebook posts
              </template>
              <template v-slot:title>
                Assessing facebook posts
              </template>
              <template v-slot:body>
                <p>
                  For assessing an article that is embedded inside a post, you can simply navigate to the article's page and assess it. The assessments of the article will be displayed on the post.
                </p>
                <p>
                  If you want to assess a <span class="font-weight-medium">post itself</span> on Facebook, you need to navigate to the page where the post is identified via its URL <span class="font-weight-medium">by clicking on the time the post was posted</span>:
                </p>

                <v-row no-gutters justify="center">
                  <v-img :src="images('facebookTimestamp')" contain max-width="230"></v-img>
                </v-row>
                
                <p class="mt-4">
                  Once you are on the post's page, you can assess it or ask about its accuracy:
                </p>

                <v-img :src="images('assessingFacebookPost')" contain max-width="500"></v-img>

                <p class="mt-6">
                  If you encounter a facebook post that has been assessed or inquired about, the assessment indicator will be placed next to the time the post was posted, as shown here:
                </p>

                <v-row no-gutters justify="center">
                  <v-img :src="images('assessedFacebookPost')" contain max-width="230"></v-img>
                </v-row>

              </template>
            </about-card>


          </v-tab-item>


             <v-tab-item value="reheadline">

            <about-card categoryType="general">
              <template v-slot:category>
                General
              </template>
              <template v-slot:title>
                What's cool about the Reheadline extension?
              </template>
              <template v-slot:body>
                <p>
                  The Reheadline extension identifies news headlines on any article's page and lets you submit alternative headlines. Then whenever those who follow you come across the headline <span class="font-weight-medium">anywhere on the web</span> (e.g., in their social media feed or the homepage of the news source), they will see your suggested alternative headline alongside the original. This lets you do something about sensationalist, misinformative, or clickbaity headlines.  
                </p>

              </template>
            </about-card>

            <about-card categoryType="settings" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.settings}}</v-icon> Installation
              </template>
              <template v-slot:title>
                Installation
              </template>
              <template v-slot:body>
                <p>
                  Visit <a href="https://chrome.google.com/webstore/detail/reheadline/iignpdlabbnnacdkchpnpljkhdlkblbh" target="_blank"> this link </a> and add the extension to your Chrome browser.
                </p>

                <p>
                Because the extension delivers customized alternative headlines to you (i.e., the headlines suggested by those you explicitly mark as trustworthy and those you follow), you will need to log in. To log in, open a tab in your browser and navigate to any website, for example <a href="https://www.nytimes.com/" target="_blank">The New York Times</a>.
                </p>

                <p>
                  The login pane for the extension will open on the side of the page. Log in with your {{siteName}} credentials.
                </p>

                <v-row no-gutters justify="center">
                  <v-img :src="images('reheadlineLogin')" contain max-width="150"></v-img>
                </v-row>
                
              </template>
            </about-card>
           
            <about-card categoryType="news" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.news}}</v-icon> Suggesting headlines
              </template>
              <template v-slot:title>
                Suggesting alternative headlines
              </template>
              <template v-slot:body>
                <p>
                  On some websites, whenever you visit an article, the extension identifies the headline on the page. It will highlight the headline and add an edit button next to it:
                </p>

                <v-img :src="images('headlineRecognized')" contain max-width="500"></v-img>

                <p class="mt-4">
                  Once you click on the edit button, you can write your own headline for the article and submit it. The alternative headline will then be displayed on the article, like this:
                </p>

                <v-img :src="images('alternativeHeadlines')" contain max-width="500"></v-img>

                <p class="mt-4">
                  You can edit or delete your submitted headlines. 
                </p>
                
              </template>
            </about-card>

            <about-card categoryType="news" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.news}}</v-icon> Recognize headlines
              </template>
              <template v-slot:title>
                Making headlines editable
              </template>
              <template v-slot:body>
                <p>
                  The Reheadline extension will recognize the article headline on websites that it knows to be news websites. If you encounter a news website whose headlines are not highlighted for editing, you can inform the extension that the current website is in fact a news website and that it should try to identify its headlines and make them editable for all the users of the extension. You can do so by clicking on the extension's action button (added to the browser's navbar) which opens a popup. From the popup, select Identify Headlines.
                </p>

                <v-img :src="images('identifyUnrecognizedHeadlines')" contain max-width="500"></v-img>
                <p class="mt-5">
                  If you do not see the extension's action button, it is possible that it is collapsed under Chrome's puzzle icon.
                </p>
            
                
              </template>
            </about-card>

            <about-card categoryType="settings" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.disable}}</v-icon> Disabling extension
              </template>
              <template v-slot:title>
                Disabling the extension on select domains
              </template>
              <template v-slot:body>
                <p>
                If you do not want to see alternative headlines submitted by the users of the extension on a particular website, you can add the website to the list of websites the extension should be disabled on. You can do that by visiting the options page of the extension, as shown in the video:
                </p>
                
                <v-row no-gutters justify="center" class="iframe-container">
                  <iframe src="https://drive.google.com/file/d/1dpLAljhttI4qs9ES56FmGQHYyRj4us2X/preview"  allow="autoplay"></iframe>
                </v-row>

              </template>
            </about-card>


            <about-card categoryType="settings" height="80px">
              <template v-slot:category>
                <v-icon small>{{icons.link}}</v-icon> Following links
              </template>
              <template v-slot:title>
                Following a link with an alternative headline next to it
              </template>
              <template v-slot:body>
                <p>
                  If you see a link e.g., on a news website's homepage or your Twitter feed that has an alternative headline next to it, to follow the link and open the article, you need to click on the old headline that has been struck through. Clicking on the new alternative headline will open the Alternative Headline pane where you can suggest new headlines for the article.

                </p>

              </template>
            </about-card>

          </v-tab-item>

        </v-tabs-items>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import aboutCard from '@/components/AboutCard'
import consts from '@/services/constants'
import { mdiGavel, mdiTwitter, mdiNewspaperVariantOutline, mdiCogPlay, mdiFacebook, mdiPuzzle, mdiPower, mdiLink, mdiCogOutline } from '@mdi/js';

export default {
  components: {
    'custom-toolbar': customToolbar,
    'about-card': aboutCard
  },
  props: {
    activeTab: null
  },
  data() {
    return {
      tabs: null,
      prefix: '.',
      icons: {
        gavel: mdiGavel,
        twitter: mdiTwitter,
        news: mdiNewspaperVariantOutline,
        settings: mdiCogOutline,
        facebook: mdiFacebook,
        puzzle: mdiPuzzle,
        disable: mdiPower,
        link: mdiLink
      }
    }
  },
  created() {
    if (this.activeTab) {
      this.tabs = this.activeTab;
      this.prefix = '..'
    }
  },
  computed: {
    siteName: function() {
      return consts.SITE_NAME;
    } 
  },
  methods: {
    images: function(key) {
      if (key == 'assessingArticles')
        return  `${this.prefix}/images/news-articles-assessments.png`;
      else if (key == 'assessingTweets')
        return `${this.prefix}/images/assessing-tweets.png`;
      else if (key == 'assessedTweets') 
        return `${this.prefix}/images/tweets-assessed.png`;
      else if (key == 'trustnetExtensionLogin')
        return `${this.prefix}/images/trustnet-extension-login-pane.png`;
      else if (key == 'facebookTimestamp')
        return `${this.prefix}/images/facebook-post-timestamp.png`;
      else if (key == 'assessingFacebookPost')
        return `${this.prefix}/images/assessing-facebook-post.png`;
      else if (key == 'assessedFacebookPost')
        return `${this.prefix}/images/assessed-facebook-post.png`;
      else if (key == 'reheadlineLogin')
        return `${this.prefix}/images/reheadline-login-pane.png`;
      else if (key == 'headlineRecognized')
        return `${this.prefix}/images/headline-recognized.png`;
      else if (key == 'alternativeHeadlines')
        return `${this.prefix}/images/alternative-headlines.png`;
      else if (key == 'identifyUnrecognizedHeadlines')
        return `${this.prefix}/images/action-button-identify-headlines.png`;
      }
      
  }
}
</script>

<style scoped>
.iframe-container {
   overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.iframe-container iframe {
   border: 0;
   height: 100%;
   left: 0;
   position: absolute;
   top: 0;
   width: 100%;
}
</style>