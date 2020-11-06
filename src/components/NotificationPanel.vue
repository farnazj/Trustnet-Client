<template>


    <v-menu v-model="notifMenu"
          :close-on-content-click="false" max-height="50vh"
          :nudge-width="120" offset-y left attach>

          <template v-slot:activator="{ on }">
                <v-btn text icon v-on="on" >
                      <v-badge overlap v-if="notSeenCount"
                        color="light-green darken-3"
                        :content="notSeenCount">
                        <v-icon>notifications</v-icon>
                    </v-badge>

                    <v-icon v-else>notifications</v-icon>

                </v-btn>
          </template>
          <v-card>
            <v-list dense class="py-0">
              <template v-for="(notification, index) in notifications">

                <v-list-item :key="`item-${index}`" @click="prepareRedirect(notification)" :class="['px-2', notification.clicked ? 'clicked-notif' : 'not-clicked-notif']">
                    <v-list-item-content>
                        <v-list-item-subtitle v-html="notification.text" class="caption notif-text"> </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider :key="`divider-${index}`" v-if="index < notifications.length - 1"></v-divider>
                 
              </template>
              <v-list-item v-if="!notifications.length" class="px-2">
                    <v-list-item-content>
                    <v-list-item-subtitle class="caption notif-text"> You have no notifications</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

                <v-list-item v-if="notifications.length && showLoadMore" @click="loadMore(true)" class="px-2">
                    <v-list-item-content >
                        <v-list-item-subtitle class="caption notif-text"> 
                            <p class="centered">Load More</p>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="notifications.length && !showLoadMore" class="px-2">
                    <v-list-item-content >
                    <v-list-item-subtitle class="caption notif-text">
                        <p class="centered">You have no other notifications</p> 
                        
                    </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-card>

        </v-menu>
       
</template>

<script>
import notificationServices from '@/services/notificationServices'

export default {
    data() {
        return {
            limit: 7,
            offset: 0,
            notifications: [],
            notSeenCount: null,
            notifMenu : false,
            showLoadMore: true
        }
    },
    created() {
       this.loadMore(false);
    },
    methods: {
        updateSeen: function() {

           let prevUnseenNotifs = this.notifications.filter(notif => !notif.seen).map(notif => notif.id);

            let notifProms = [];
            this.notifications.forEach((notif, index) => {
                if (prevUnseenNotifs.includes(notif.id)) {
                    notifProms.push(notificationServices.changeSeenStatus({ notifId: notif.id }, {
                        seen_status: 'seen' })
                    .then(res => {
                        this.notifications[index].seen = true;
                    }))
                }
                
            })

            Promise.all(notifProms)
            .then(res => {
                this.notSeenCount -= prevUnseenNotifs.length;
            })

        },
        loadMore: function(notifsAreSeen) {
            notificationServices.getNotifications({
                limit: this.limit,
                offset: this.offset
            })
            .then( resp => {
                if (resp.data.notifications.length) {
                    this.notifications.push(...resp.data.notifications);
                    this.notSeenCount = resp.data.notSeenCount;
                    this.offset += resp.data.notifications.length;

                    if (notifsAreSeen)
                        this.updateSeen();
                }
                else {
                    this.showLoadMore = false;
                }
                
            })
        },
        prepareRedirect: function(notification) {
            notificationServices.clickOnNotifation({ notifId: notification.id});
            window.location.href = notification.link;
        }
    },
    watch: {
        notifMenu: function(newVal) {
            if (newVal) {
                this.updateSeen(true);
            }
        }
    }
}
</script>

<style scoped>
.notif-item {
    text-decoration: none;
}
.notif-text {
    font-size: 0.7em !important;
}
.centered {
    margin: 0 auto;
    width: max-content;
}
.not-clicked-notif {
    background: #F9FBE7;
}

</style>