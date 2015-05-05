class FilmSpec {
    constructor(factory, currentUser) {
        //Factory is generic so that it can be used
        //by reels, clips, games, etc
        this.factory = factory;
        this.currentUser = currentUser;
        this.currentRoleId = currentUser.currentRole.type.id;
    }
    isSharedWithPublic() {
        //check if public
        return this.factory.isSharedWithPublic();
    }
    isFilmOwner() {
        //If user is not a coach, check if the film is owned by the user
        return (this.currentRoleId !== 3 && this.currentRoleId !== 4) &&
            this.factory.uploaderUserId == this.currentUser.currentRole.userId;
    }
    isUserOnTeam() {
        //If user is a coach, check if the user is on owner's team
        return (this.currentRoleId == 3 || this.currentRoleId == 4) &&
            (this.factory.uploaderTeamId == this.currentUser.currentRole.teamId);
    }
    isSharedWithUser() {
        //If user is not a coach, check if the film is shared with the
        //user
        return this.currentRoleId !== 3 && this.currentRoleId !== 4 &&
            this.factory.isSharedWithUser(this.currentUser);
    }
    isSharedWithTeam() {
        //If user is not a coach, check if the film is shared with the
        //user's team
        return this.currentRoleId !== 3 && this.currentRoleId !== 4 &&
            this.factory.isSharedWithTeam(this.currentUser);
    }
    isAllowedToView() {
        if (this.isSharedWithPublic() ||
            this.isFilmOwner() ||
            this.isUserOnTeam() ||
            this.isSharedWithUser() ||
            this.isSharedWithTeam()) {
            return true;
        }

        return false;
    }
}

export default FilmSpec;
