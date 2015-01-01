StyleStorage = {
    dbVersion: '1.0',
    dbName: 'purstyle',
    styleTableName: 'styles',
    db: null,

    init: function(){
        this.getDb(function(){});
    },

    getDb: function(done, error){
        if(this.db != null && this.db.version == this.dbVersion) {
            done(this.db);
            return;
        }

        try{
            this.db = openDatabase(this.dbName, '', 'purstyle Styles', 3*1024*1024);
            this.db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS `'+ StyleStorage.styleTableName +'` (\
                    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                    `name` TEXT NOT NULL,\
                    `description` TEXT NOT NULL,\
                    `match` TEXT NOT NULL,\
                    `code` TEXT NOT NULL,\
                    `enabled` INTEGER NOT NULL);');
            });
        }catch(ex){
            throw ex;
        }

        // TODO 升级数据库

        done(this.db);
    },

    saveStyle: function(data, done, error){
        this.getDb(function(db){
            db.transaction(function(tx){
                if(data.id == 0){
                    var sql = "INSERT INTO `"+ StyleStorage.styleTableName +"` \
                    (`name`, `description`, `match`, `code`, `enabled`) values(?, ?, ?, ?, ?)";
                    tx.executeSql(sql, [data.name, data.description, data.match, data.code, data.enabled], function(){
                        done();
                    }, function(){
                        error();
                    });
                }else{
                    var sql = "UPDATE `"+ StyleStorage.styleTableName +"` set \
                    `name` = ?, `description` = ?, `match` = ?, `code` = ?, `enabled` = ? WHERE `id` = ?";
                    tx.executeSql(sql, [data.name, data.description, data.match, data.code, data.enabled, data.id], function(){
                        done();
                    }, function(){
                        error();
                    });
                }
            });
        });
    },

    getStyle: function(id, done, error){
        this.getDb(function(db){
            db.readTransaction(function(tx){
                var sql = "SELECT * FROM `"+ StyleStorage.styleTableName +"` WHERE `id` =  ?";
                tx.executeSql(sql, [id], function(tx, result){
                    if(result.rows.length > 0){
                        done(result.rows.item(0));
                    }else{
                        done(false);
                    }
                }, function(){
                    error();
                });
            });
        });
    },

    delStyle: function(id, done, error){
        this.getDb(function(db){
            db.transaction(function(tx){
                if(data.id != 0){
                    var sql = "DELETE FROM `"+ StyleStorage.styleTableName +"` WHERE `id` = ?";
                    tx.executeSql(sql, [id], function(){
                        done();
                    }, function(){
                        error();
                    });
                }
            });
        });
    },

    getAllStyles: function(done, error){
        this.getDb(function(db){
            db.readTransaction(function(tx){
                var sql = "SELECT * FROM `"+ StyleStorage.styleTableName +"` ORDER BY `id` DESC";
                tx.executeSql(sql, [], function(tx, result){
                    data = [];
                    for(var i = 0; i < result.rows.length; ++i){
                        data[i] = result.rows.item(i);
                    }
                    done(data);
                }, function(){
                    error();
                });
            });
        });
    },
}

StyleStorage.init();
