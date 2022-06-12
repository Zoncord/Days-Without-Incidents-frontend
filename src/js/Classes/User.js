import BaseInformation from "src/js/ParenClasses/BaseInformation";
import GeneralUserInformation from "src/js/ParenClasses/GeneralUserInformation";

export default class User extends BaseInformation {
  constructor(props) {
    super(props ? props : {});
    this.description = props.description
    this.followers = props.followers_count
    this.generalInfo = new GeneralUserInformation(props.general_user_information)
  }
  changeDescription(description){
    this.description = description
  }

  increaseFollowers() {
    this.followers += 1
  }

  decreaseFollowers() {
    this.followers -= 1
  }
}

