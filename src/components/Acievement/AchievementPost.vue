<template>
  <div class="achievement__blog__post q-card  q-mb-md">
    <h4 class="achievement__blog__post__title" v-if="title">{{ title }}</h4>
    <q-skeleton width="200px" height="40px" class="achievement__blog__post__title-skeleton q-mb-md" v-else/>
    <div class="achievement__blog__post__time">
      <p v-if="date" class="q-mr-sm">{{ date }}</p>
      <q-skeleton width="100px" v-else class="q-mr-sm"/>
      <p class="q-mr-sm"> {{ $t('achievement.at') }}</p>
      <p v-if="date" class="q-mr-sm">{{ time }}</p>
      <q-skeleton width="100px" v-else/>
    </div>

    <article class="achievement__blog__post__text" v-if="description">{{ description }}</article>
    <RandomSkeletonDescription
      class="achievement__blog__post__text-skeleton q-my-xl"
      v-else
    />
    <div class="flex justify-between">
      <a class="flex items-center" :href="`/profile/${ownerId}`">
        <UserImage
          class="achievement__blog__post__user-logo"
          :url="ownerImage"
        />
        <UserName :name="ownerName"/>
      </a>

      <nav class="achievement__blog__controls flex items-center ">
        <q-btn icon="chat" class="achievement__blog__controls__btn" :ripple="false"></q-btn>
        <q-btn
          icon="favorite"
          class="achievement__blog__controls__btn like-btn"
          :ripple="false"
          :class="{liked: this.isLiked}"
          @click="handleLiking()"
        />
        <h5 class="achievement__blog__controls__likes" v-if="likesCount !== null">
          {{ likesCount }}
        </h5>
        <q-skeleton width="40px" v-else/>
      </nav>
    </div>
    <ContextMenu v-if="ownerId === this.$userId" type="post" :parent-id="id"/>
  </div>
</template>

<script>
import UserImage from "components/Core/User/UserImage";
import {mapGetters} from "vuex";
import ContextMenu from "components/Core/ContextMenu";
import UserName from "components/Core/User/UserName";
import RandomSkeletonDescription from "components/Core/Skeleton/RandomSkeletonDescription";

export default {
  name: "AchievementPost",
  components: {
    UserImage,
    ContextMenu,
    UserName,
    RandomSkeletonDescription,
  },
  props: {
    url: {
      required: true,
    },
    ownerUrl: {
      required: true,
    },
  },
  methods: {
    ...mapGetters('mainStore', ['token']),
    async getUserData() {
      await this.$axios.get(this.ownerUrl, {
        headers: {
          Authorization: 'Token ' + this.token()
        }
      }).then(res => {
        this.ownerId = res.data.id
        this.ownerName = res.data.general_user_information.first_name + ' ' + res.data.general_user_information.last_name
        this.ownerImage = res.data.general_user_information.img
      })
    },
    async getPostData() {
      await this.$axios.get(this.url, {
        headers: {
          Authorization: 'Token ' + this.token()
        }
      }).then(res => {
        let creationDate = new Date(res.data.date_time_of_creation)
        this.id = res.data.id
        this.title = res.data.title
        this.date = creationDate.toLocaleDateString()
        this.time = creationDate.toLocaleTimeString()
        this.description = res.data.description
      })
    },
    async getLikesData() {
      await this.$axios.get(`${this.$dwiApi}rating/post/`, {
        params: {
          post: this.id
        },
        headers: {
          Authorization: 'Token ' + this.token()
        }
      }).then(res => {
        this.likesCount = res.data.count
      })
    },
    async getIsLiked() {
      await this.$axios.get(this.$dwiApi + 'rating/post', {
        params: {
          post: this.id,
          user: this.$userId,
        },
        headers: {
          Authorization: 'Token ' + this.token()
        }
      }).then(res => {
        this.isLiked = Boolean(res.data.count)
      })
    },
    async handleLiking() {
      if (this.isLiked) {
        await this.$axios.get(this.$dwiApi + 'rating/post/', {
          params: {
            post: this.id,
            user: this.$userId,
          },
          headers: {
            Authorization: 'Token ' + this.token()
          }
        }).then(async res => {
          await this.$axios.delete(res.data.results[0].url, {
            headers: {
              Authorization: 'Token ' + this.token()
            }
          })
        })
        this.likesCount -= 1
      } else {
        await this.$axios.post(this.$dwiApi + 'rating/post/', {
            user: this.$userUrl,
            post: this.$dwiApi + `blog/post/${this.id}/`,
          },
          {
            headers: {
              Authorization: 'Token ' + this.token()
            }
          })
        this.likesCount += 1
      }
      this.isLiked = !this.isLiked
    },

  },
  async mounted() {
    await this.getUserData()
    await this.getPostData()
    await this.getLikesData()
    await this.getIsLiked()
  },
  data() {
    return {
      likesUnit: '',
      isLiked: false,
      likesCount: null,
      image: null,
      ownerName: null,
      ownerImage: null,
      ownerId: null,
      title: null,
      description: null,
      date: null,
      time: null,
      id: null,
    }
  }
}
</script>

<style lang="scss" scoped>
.achievement__blog__post__title-skeleton {
  border-radius: 5px !important;
}

.user-name {
  font-size: 25px;
}

.achievement__blog__post__time {
  * {
    display: inline-block;
  }
}

.achievement__blog__post {
  padding: 40px;
  width: 100%;

}

.achievement__blog__post__title {
  margin-bottom: 5px;
  font-weight: 500;
  word-break: break-all;
}

.achievement__blog__post__text {
  font-size: 20px;
  margin-top: 60px;
  margin-bottom: 60px;
  white-space: pre-line;
  word-break: break-all;
}

.achievement__blog__user-name {
  font-weight: 400;
}

.achievement__blog__controls__btn {
  font-size: 20px;
  border: none;
  width: 50px;
}

.achievement__blog__controls__likes {
  font-weight: 400;
}

.achievement__blog__post__user-logo {
  width: 100px;
  margin-right: 20px;
}
</style>
