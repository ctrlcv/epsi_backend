const Utils = require('./../service/utils');
const sql = require('./../database/dbconnection');

exports.getGroupCode = async () => {
    try {
        const query =
            `
                SELECT  Id AS groudid,
                        Group_cd AS groupcd,
                        Grdoup_name AS groupname,
                        Group_color AS groupcolor
                  FROM tb_group_cd
                 ORDER BY Group_cd
            `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getMaterialCode = async () => {
    try {
        const query =
            `
                SELECT  Id AS materialid,
                        material_cd AS materialcd,
                        material_name AS materialname
                  FROM tb_metarial_cd
                 ORDER BY Id
            `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getTypeCode = async () => {
    try {
        const query =
            `
                SELECT  Id AS typeid,
                        type_cd AS typecd,
                        type_name AS typename
                  FROM tb_type_cd
                 ORDER BY Id
            `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getEpsiData = async (lat, lon) => {
    try {
        const query =
            `
                SELECT  a.Id AS id,    
                        a.Pipe_group AS pipegroup,      b.Grdoup_name AS pipegroupname,
                        b.Group_color AS pipegroupcolor,
                        a.Pipe_type AS pipetype,        c.type_name AS pipetypename,
                        a.Pipe_Diameter AS diameter,    
                        a.Pipe_material AS material,    d.material_name AS materialname,
                        a.Distance AS distance,         a.Depth AS pipedepth,
                        a.Position_x AS positionx,      a.Position_y AS positiony, 
                        a.Offer_company AS offercompany, 
                        a.Company_phone AS companyphone,
                        a.memo, 
                        a.Build_Company AS buildcompany, 
                        a.Build_phone AS buildphone, 
                        a.Site_image AS siteimageurl,
                        SQRT(POWER(ABS(${lat} - a.Position_x), 2) + POWER(ABS(${lon} - a.Position_y), 2)) as locdistance
                  FROM tb_epis AS a, tb_group_cd AS b, tb_type_cd AS c, tb_metarial_cd AS d
                 WHERE a.Pipe_group = b.Group_cd 
                   AND a.Pipe_type = c.type_cd
                   AND a.Pipe_material = d.material_cd
                 ORDER BY locdistance
            `
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}