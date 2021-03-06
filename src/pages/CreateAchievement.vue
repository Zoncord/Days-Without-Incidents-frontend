<template>
  <UI :footer="false" :limiter="false">
    <q-form
      @validation-success="nextStage()"
      @submit.prevent=""
      class="flex column text-center"
    >
      <h5 class="create-achievement__title">{{ $t('createAchievement.title') }}</h5>
      <q-tab-panels v-model="activeTab">
        <q-tab-panel :name="1" class="limiter create-achievement__fist-stage">
          <q-input
            outlined
            v-model="title"
            borderless
            :placeholder="$t('createAchievement.firstStage.title') + ' *'"
            maxlength="64"
            :rules="[ val => val && val.length > 0 || $t('errors.inputs.emptyField')]"
            class="create-achievement__fist-stage__title-input"
            :model-value="title">
            <template v-slot:append>
              <p class="create-achievement__fist-stage__input-counter create-achievement__input">
                {{ 64 - title.length }}
              </p>
            </template>
          </q-input>

          <q-input
            type="textarea"
            class="create-achievement__fist-stage__description-input"
            outlined
            v-model="description"
            :model-value="description"
            autogrow
            maxlength="128"
            :placeholder="$t('createAchievement.firstStage.description') + ' *'"
            :rules="[ val => val && val.length > 0 || $t('errors.inputs.emptyField')]"
          >
            <template v-slot:append class="create-achievement__fist-stage__input-counter create-achievement__input">
              <p class="create-achievement__fist-stage__input-counter">
                {{ 128 - description.length }}
              </p>
            </template>
          </q-input>
        </q-tab-panel>

        <q-tab-panel :name="2" class="create-achievement__second-stage limiter flex justify-between">
          <q-input
            class="create-achievement__second-stage__item create-achievement__second-stage__input"
            outlined
            :placeholder="$t('createAchievement.secondStage.category')"
            :model-value="category"
            v-model="category"
          ></q-input>
          <TagsComponent
            class="create-achievement__second-stage__item"
            :tags="tags"
            :max-tags="20"
            @deleteTag="deleteTag"
            @addTag="addTag"
          />
        </q-tab-panel>
      </q-tab-panels>

      <ProgressFormBar
        @checkValidation="checkValidation()"
        @previousStage="previousStage()"
        @finish="finish()"
        :active-stage="activeTab"
        :stages-count="stagesCount"
      />
    </q-form>
  </UI>
</template>

<script>
import ProgressFormBar from "components/CreateAchievement/ProgressFormBar";
import TagsComponent from "components/CreateAchievement/TagsComponent";
import {mapGetters} from "vuex";
import UI from "components/Ui/UI";

export default {
  name: "CreateCard",
  components: {
    ProgressFormBar,
    TagsComponent,
    UI,
  },
  data() {
    return {
      activeTab: 1,
      stagesCount: 2,
      isValid: false,
      title: '',
      description: '',
      category: '',
      tags: [],
      maxTags: 20,
    }
  },
  methods: {
    ...mapGetters('mainStore', ['token']),
    nextStage() {
      if (this.activeTab < this.stagesCount)
        this.activeTab += 1
      this.isValid = false
    },
    previousStage() {
      if (this.activeTab > 1) {
        this.activeTab -= 1
      }
    },
    checkValidation() {
      if (this.isValid) {
        this.nextStage()
      }
    },
    async finish() {
      let categoryUrl
      if (this.category) {
        await this.$axios.post(`${this.$dwiApi}achievements/category/`, {
          title: this.category,
        }, {
          headers: {
            Authorization: `Token ${this.userToken()}`
          }
        }).then(res => {
          categoryUrl = res.data.url
        })
      }
      await this.$axios.post(this.$dwiApi + 'achievements/achievement/', {
        title: this.title,
        description: this.description,
        tags: this.tags.map((tag) => {return tag.url}),
        category: this.category ? categoryUrl: null,
      }, {
        headers: {
          Authorization: `Token ${this.userToken()}`
        }
      })
      this.$router.go(-1)
    },
    deleteTag(id) {
      this.tags.splice(id, 1)
    },
    addTag(tag) {
      if (tag && this.tags.length < this.maxTags) {
        this.$axios.post(`${this.$dwiApi}achievements/tag/`, {
          title: tag,
        }, {
          headers: {
            Authorization: `Token ${this.token()}`,
          }
        }).then(res => {
          this.tags.unshift({
            tag: tag,
            url: res.data.url,
          })
        })
      }
    },
  },
  computed: {
    userToken(){
      return this.token
    }
  }
}
</script>
<style lang="scss" scoped>
.limiter {
  flex-grow: 2;
  margin-bottom: 85px;
}

</style>

<style lang="scss">
.create-achievement__title {
  margin-top: 60px;
  margin-bottom: 60px;
}

.create-achievement__fist-stage__title-input {
  margin-bottom: 20px;

  .q-field__control {
    height: 40px;
  }

  .q-field__append {
    height: 40px;
  }
}

.create-achievement__fist-stage__description-input {
  .q-field__control {
    min-height: 150px;
  }
}

.create-achievement {
  height: 100vh;
  position: relative;
}

.progress-form-bar {
  position: fixed;
  bottom: 0;
}

.create-achievement__fist-stage__input-counter {
  font-size: 15px !important;
}

//Second Stage
.create-achievement__second-stage__item {
  width: calc(50% - 10px);
}

.create-achievement__second-stage__input {
  .q-field__control {

    height: 30px;

    .q-field__append {
      height: 30px;
    }

    .q-field__prepend {
      height: 30px;
    }
  }

}


</style>
