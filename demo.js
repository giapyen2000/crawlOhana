const axios = require("axios");
const {
    sequelize,
    Sequelize
} = require('./models');
const models = sequelize.models;

var db = require('./models/index');
db.sequelize.sync();
/**
 * 
 * @param {*} url 
 * @param {*} page 
 * @param {*} pageNumber 
 * @param {*} roomLocation 
 */
const getListOhana = async (page, pageNumber, roomLocation) => {
    try {
        const url = 'https://www.ohanaliving.vn/api/web/rooms/view-all';

        const response = await axios.post(url, {
            "matchData": {
                "disabled": {
                    "$ne": true
                }
            },
            "room_location": roomLocation,
            "page": page,
            "page_number": pageNumber,
            "filters": {}
        });

        for (let i = 0; i < pageNumber; i++) {
            const idFirst = encryptRoomId(response.data.data[i]._id, 'first')
            const idLast = encryptRoomId(response.data.data[i]._id, 'last')
            const idRoom = idFirst + idLast
            getDetail(idRoom)
        }

        return getListOhana(page + 1, pageNumber, roomLocation)
    } catch (error) {
        console.log(error);
    }
}

getListOhana(1, 20, "HCM")

const getDetail = async (idRoom) => {
    try {
        const url = await axios.get(`https://www.ohanaliving.vn/api/web/rooms/getById?roomId=${idRoom}`);
        const name = await url.data.data[0].userInfo[0].first_name
        const title = url.data.data[0].room_name;
        const price = url.data.data[0].room_price;
        const content = url.data.data[0].notes;
        const address = url.data.data[0].exact_room_address;
        const area = url.data.data[0].room_area;
        const location = url.data.data[0].room_location;
        const phone = url.data.data[0].phone_number;
        const img = url.data.data[0].upload_room_images;

        const post = await models.Post.create({
            name: name,
            title: title,
            price: price,
            content: content,
            phone: phone,
            address: address,
            area: area,
            location: location
        });

        for (const image of img) {
            await models.image.create({
                imgUrl: image,
                image_id: post.id
            })
        }
        return {
            name,
            title,
            price,
            content,
            phone,
            address,
            area,
            location,
            img
        }
    } catch (error) {
        console.log(error);
    }
}

let encryptRoomId = function (e, n) {
    var t = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "w"],
        o = e.match(/.{6}/g).map(function (e) {
            return Number(parseInt(e, 16).toString(10))
        }),
        a = [];
    return o.forEach(function (e, n) {
            var o = t[Math.floor(Math.random() * t.length)];
            a.push(e - 99999 + (3 === n ? "" : o))
        }),
        "first" === n ? a[0] + a[1] : "last" === n ? a[2] + a[3] : void 0
}