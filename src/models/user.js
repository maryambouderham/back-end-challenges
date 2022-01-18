class UserModel {
    constructor(
        firstname = "",
        lastname = "",
        email = "",
        password = "",
        avatar_url = "hhhh",
        isVerified=0,
        email_token="",
        expirationDate=new Date(),
        phone=0,
        adress="hhhhh",
        age=0,
        MorF="MALE",
        role="CANDIDAT",
        id = null) {
        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.avatar_url = avatar_url
        this.email = email
        this.password = password
        this.isVerified = isVerified
        this.expirationDate = expirationDate
        this.email_token = email_token
        this.phone=phone
        this.adress=adress
        this.age=age
        this.MorF=MorF
        this.role=role
    }
   
}

exports.UserModel = UserModel