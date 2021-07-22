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
                        a.set_position AS setPosition,
                        a.distance_direction AS distanceDirection,
                        a.Pipe_Diameter AS diameter,    
                        a.Pipe_material AS material,    d.material_name AS materialname,
                        a.Distance AS distance,
                        a.distance_lr AS distanceLr,
                        a.Depth AS pipedepth,
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

exports.findEpsiId = async (positionX, positionY) => {
    try {
        const query =
            `
               SELECT Id AS id
                 FROM tb_epis
                WHERE Position_x = ${positionX}
                  AND Position_y = ${positionY} `;
        const result = await sql.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.insertEpsiData = async (pipegroup,      pipetype, 
                                setPosition,    distanceDirection,  diameter,           material, 
                                distance,       distanceLr,         pipedepth,          positionx, 
                                positiony,      offercompany,       companyphone,       memo,
                                buildcompany,   buildphone,         siteimageurl) => {
    try {
        let query1 = `
            INSERT INTO tb_epis 
                ( Pipe_group, Pipe_type`;

        let query2 = `) VALUES ( `;

        let query3 = `'${pipegroup}', '${pipetype}'`;

        let query4 = `)`;

        if (!Utils.isNull(setPosition)) {
            query1 += `, set_position`;
            query3 += `, '${setPosition}'`;
        }

        if (!Utils.isNull(distanceDirection)) {
            query1 += `, distance_direction`;
            query3 += `, '${distanceDirection}'`;
        }

        if (!Utils.isNull(diameter)) {
            query1 += `, Pipe_Diameter`;
            query3 += `, ${diameter}`;
        }
        
        if (!Utils.isNull(material)) {
            query1 += `, Pipe_material`;
            query3 += `, '${material}'`;
        }

        if (!Utils.isNull(distance)) {
            query1 += `, Distance`;
            query3 += `, ${distance}`;
        }

        if (!Utils.isNull(distanceLr)) {
            query1 += `, distance_lr`;
            query3 += `, ${distanceLr}`;
        }

        if (!Utils.isNull(pipedepth)) {
            query1 += `, Depth`;
            query3 += `, ${pipedepth}`;
        }

        if (!Utils.isNull(positionx)) {
            query1 += `, Position_x`;
            query3 += `, ${positionx}`;
        }

        if (!Utils.isNull(positiony)) {
            query1 += `, Position_y`;
            query3 += `, ${positiony}`;
        }

        if (!Utils.isNull(offercompany)) {
            query1 += `, Offer_company`;
            query3 += `, '${offercompany}'`;
        }

        if (!Utils.isNull(companyphone)) {
            query1 += `, Company_phone`;
            query3 += `, '${companyphone}'`;
        }

        if (!Utils.isNull(memo)) {
            query1 += `, memo`;
            query3 += `, '${memo}'`;
        }

        if (!Utils.isNull(buildcompany)) {
            query1 += `, Build_Company`;
            query3 += `, '${buildcompany}'`;
        }

        if (!Utils.isNull(buildphone)) {
            query1 += `, Build_phone`;
            query3 += `, '${buildphone}'`;
        }

        if (!Utils.isNull(siteimageurl)) {
            query1 += `, Site_image`;
            query3 += `, '${siteimageurl}'`;
        }

        console.log(query1 + query2 + query3 + query4);
        return await db.query(query1 + query2 + query3 + query4);
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.updateEpsiData = async (id,             pipegroup,      pipetype,       setPosition,    distanceDirection, 
                                diameter,       material,       distance,       distanceLr,     pipedepth,      
                                positionx,      positiony,      offercompany,   companyphone,   memo,           
                                buildcompany,   buildphone,     siteimageurl) => {
    try {
        let query = `
            UPDATE tb_epis 
                SET
                    id = ${id}`;
                    
        if (!Utils.isNull(pipegroup)) {
            query += `, Pipe_group = '${pipegroup}'`;
        }

        if (!Utils.isNull(pipetype)) {
            query += `, Pipe_type = '${pipetype}'`;
        }

        if (!Utils.isNull(setPosition)) {
            query += `, set_position = '${setPosition}'`;
        }

        if (!Utils.isNull(distanceDirection)) {
            query += `, distance_direction = '${distanceDirection}'`;
        }

        if (!Utils.isNull(diameter)) {
            query += `, Pipe_Diameter = ${diameter}`;
        }

        if (!Utils.isNull(material)) {
            query += `, Pipe_material = '${material}'`;
        }

        if (!Utils.isNull(distance)) {
            query += `, Distance = ${distance}`;
        }

        if (!Utils.isNull(distanceLr)) {
            query += `, distance_lr = ${distanceLr}`;
        }

        if (!Utils.isNull(pipedepth)) {
            query += `, Depth = ${pipedepth}`;
        }

        if (!Utils.isNull(positionx)) {
            query += `, Position_x = ${positionx}`;
        }

        if (!Utils.isNull(positiony)) {
            query += `, Position_y = ${positiony}`;
        }

        if (!Utils.isNull(offercompany)) {
            query += `, Offer_company = '${offercompany}'`;
        }

        if (!Utils.isNull(companyphone)) {
            query += `, Company_phone = '${companyphone}'`;
        }

        if (!Utils.isNull(memo)) {
            query += `, memo = '${memo}'`;
        }

        if (!Utils.isNull(buildcompany)) {
            query += `, Build_Company = '${buildcompany}'`;
        }

        if (!Utils.isNull(buildphone)) {
            query += `, Build_phone = '${buildphone}'`;
        }

        if (!Utils.isNull(siteimageurl)) {
            query += `, Site_image = '${siteimageurl}'`;
        }

        query += `  WHERE id = ${id} `;

        console.log(query);
        return await db.query(query);
    } catch (err) {
        console.error(err);
        return false;
    }
}