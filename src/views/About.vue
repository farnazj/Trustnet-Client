<template>
  <v-container fluid class="pt-12 px-5">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters class="pt-10">
      <h5 class="headline">About Trustnet</h5>
    </v-row>

    <v-row no-gutters justify="center">
      <v-col sm="12" md="7">
        <v-row no-gutters justify="center">
            <about-card categoryType="general">
              <template v-slot:category>
                General
              </template>
              <template v-slot:title>
                What's cool about Trustnet?
              </template>
              <template v-slot:body>
                <p>
                  Trustnet is a news reading and sharing platform where you can follow different
                  news publishing media or your friends to see what they post, write posts of your own, or
                  share posts to those you think would be interested in knowing about them.
                </p>

                <p>
                  What's cool about Trustnet is that it empowers you to curate or filter your newsfeed
                  with the help of those you trust. Of course not everyone you follow is trustworthy
                  (like that one person you follow just so that you see firshand what they say or that
                  other person you became "friends" with, just because you had to). So on Trustnet,
                  you can explicitly specify who you trust and then choose to see only those posts
                  that they have confirmed to be true or maybe the posts that they have refuted
                  and their reasons for doing so. If you feel adventurous, you can even choose to
                  see those posts that your trusted sources have disagreement on.
                </p>

                <p>
                  Of course, we know that you shouldn't have to mark someone as trustworthy
                  just to be polite. On Trustnet, no one other than you knows who you have marked as
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
                  A source is any user or a news publishing feed on Trustnet. As a user
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
                  You can click on your avatar at the righthand side of the toolbar
                  to go to the <v-icon>account_circle</v-icon> Sources page.
                  There, you can discover other sources that you might want to follow or
                  trust, make customized lists, and add sources to those lists.
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
                  On your homepage, at the lefthand side, you have access to 3
                  types of filters to tune your newsfeed:
                  </br>
                  <ul>
                    <li>
                      <span class="font-weight-medium">Seen Status:</span> articles on
                      your news feed that you have already scrolled past, or those that
                      you have not seen yet, or both.
                    </li>

                    <li>
                      <span class="font-weight-medium">Validty:</span> articles
                      that have been confirmed, refuted, or whose validity have
                      been questioned by your sources. Or those on whose validity
                      there is disagreement among your sources (debated articles).
                    </li>

                    <li>
                      <span class="font-weight-medium">Sources:</span> Sources whose
                      assessment syou want to be considered in filtering. These could
                      be those you follow, yourself, those you trust, or even specific
                      sources or lists of sources.
                    </li>
                  </ul>

                </p>
                <p>
                  All of the above filters work in conjuction with each other. For
                  example, to see the articles that you have not seen yet and that have
                  been confirmed by your trusted sources, you can select <v-icon>remove_red_eye</v-icon>
                  Seen Status <v-icon>arrow_right_alt</v-icon> Not Seen, <v-icon>gavel</v-icon>
                  Validity <v-icon>arrow_right_alt</v-icon> Confirmed, and
                  <v-icon>account_circle</v-icon> Sources <v-icon>arrow_right_alt</v-icon> Trusted.
                </p>
              </template>
            </about-card>

        </v-row>
      </v-col>

      <!--
        <v-card class="pa-2">
          <v-row no-gutters>
            <v-col cols="3" class="pa-1">
              <span class="title">How do the filters on the <v-icon>home</v-icon>
                homepage work?</span>
            </v-col>
            <v-col cols="9">
              <p>
                You can click on your avatar at the righthand side of the toolbar
                to go to the <v-icon>account_circle</v-icon> Sources page.
                There, you can discover other sources that you might want to follow or
                trust, make customized lists, and add sources to those lists.
              </p>
            </v-col>
          </v-row>
        </v-card>

      </v-col> -->

    </v-row>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import aboutCard from '@/components/AboutCard'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'about-card': aboutCard
  },
  data(){
    return {
    }
  }
}
</script>
