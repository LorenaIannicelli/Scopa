<template>
  <!-- use transition to keep showing background -->
  <transition v-if="show" name="modal">
    <div class="modal-mask">
      <div class="modal-container">
        <form class="pure-form" @submit.prevent="upload">
          <legend>Upload a picture</legend>
          <fieldset>
            <div class="imageInput" @click="chooseImage">
              <img v-if="url" :src="url" />
              <div v-if="!url" class="placeholder">Choose an Image</div>
              <input
                class="fileInput"
                ref="fileInput"
                type="file"
                @input="fileChanged"
              />
            </div>
            <p v-if="error" class="error">{{ error }}</p>
          </fieldset>
          <fieldset class="buttons">
            <button type="button" @click="close" class="pure-button">
              Close
            </button>
            <button
              id="redButton"
              type="submit"
              class="pure-button pure-button-primary right"
            >
              Upload
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  name: "Uploader",
  props: {
    show: Boolean,
  },
  data() {
    return {
      url: "",
      file: null,
      error: "",
    };
  },
  methods: {
    //if file isi changed, update
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file);
    },
    close() {
      this.$emit("close");
    },
    //react when image is picked
    chooseImage() {
      this.$refs.fileInput.click();
    },
    //upload to database
    async upload() {
      try {
        const formData = new FormData();
        formData.append("photo", this.file, this.file.name);
        let response = await axios.put("/api/users/profilePic", formData);
        this.$root.user.profilePath = response.data.path;
        this.file = null;
        this.url = "";

        this.$emit("uploadFinished");
      } catch (error) {
        this.error = "Error: " + error.response.data.message;
      }
    },
  },
};
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
}

.modal-container {
  width: 50%;
  height: max-content;
  margin-top: 80px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.5s ease;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

form {
  font-size: 11pt;
}

input {
  width: 100%;
}

.placeholder {
  background: #f0f0f0;
  width: 200px;
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.placeholder:hover {
  background: #e0e0e0;
}

.fileInput {
  display: none;
}

img {
  width: 200px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.imageInput {
  text-align: center;
}

#redButton {
  background-color: #bf211e;
}
</style>
