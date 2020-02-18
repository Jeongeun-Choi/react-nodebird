//테이블명 앞글자는 대문자로
//대문자로 적으면 알아서 users 로 앞부분 소문자로 바뀌고 뒤에 s 가 붙음

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,  //필수
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,   //고유한 값
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글이 저장된다
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post, {as: 'Posts'}); //구별하게 만든다
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
    };

    return User;
};