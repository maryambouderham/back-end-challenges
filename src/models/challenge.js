class ChallengeModel{
    constructor(
       title="",
       description="",
       image="",
       duree=0,
       price=0,
       status_challenge="AVENIR",
       level_challenge="FACILE",
       distance=0 ,
       id=null
    ){
        this.id=id
        this.title=title
        this.description=description
        this.duree=duree
        this.price=price
        this.image=image
        this.status_challenge=status_challenge
        this.level_challenge=level_challenge
        this.distance=distance

    }
}
exports.ChallengeModel=ChallengeModel