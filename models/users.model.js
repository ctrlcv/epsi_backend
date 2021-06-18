const Utils = require('./../service/utils');
const sql = require('./../database/dbconnection');

exports.findUser = async (User_id) => {
    try {
        const query = 
        `
            SELECT *
              FROM tb_user
             WHERE User_id = '${User_id}'
        `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getUser = async (userid) => {
    try {
        const query = 
        `
            SELECT *
              FROM tb_user
             WHERE User_id = '${userid}'
        `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.createUser = async (User_id, User_name, Password, Auth) => {
    try {
        let query1 = `
            INSERT INTO tb_user (
                User_id, User_name, Password, Auth`;

        let query2 = `) 
            VALUES 
                (${User_id}, '${User_name}', '${Password}', '${Auth}'`;

        let query3 = `)`;

        const result = await sql.query(query1 + query2 + query3);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.updateUser = async (Id, User_id, User_name, new_Password, Auth) => {
    try {
        let query1 = `
            UPDATE 
                    tb_user
               SET
                    Id = '${Id}'
        `;

        if (!Utils.isNull(new_Password)) {
            query1 += `,    password = '${new_Password}'`;
        }

        if (!Utils.isNull(User_name)) {
            query1 += `,    User_name = '${User_name}'`;
        }

        if (!Utils.isNull(Auth)) {
            query1 += `,    Auth = '${Auth}'`;
        }

        let query2 = `
            WHERE Id = '${Id}'
        `;

        const result = await sql.query(query1 + query2);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}