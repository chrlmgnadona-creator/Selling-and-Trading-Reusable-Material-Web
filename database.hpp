#ifndef DATABASE_HPP
#define DATABASE_HPP

#include <sqlite3.h>
#include <iostream>
#include <string>

class Database {
private:
    sqlite3* db;
public:
    Database(const std::string& filename) {
        if (sqlite3_open(filename.c_str(), &db) != SQLITE_OK) {
            std::cerr << "Error opening database: " << sqlite3_errmsg(db) << std::endl;
        } else {
            std::cout << "Connected to SQLite database successfully.\n";
            initTables();
        }
    }

    ~Database() {
        sqlite3_close(db);
    }

    void initTables() {
        const char* sqlUsers = "CREATE TABLE IF NOT EXISTS users ("
                               "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                               "name TEXT NOT NULL, "
                               "email TEXT UNIQUE NOT NULL, "
                               "password TEXT NOT NULL, "
                               "barangay TEXT NOT NULL, "
                               "phone TEXT);";

        const char* sqlMaterials = "CREATE TABLE IF NOT EXISTS materials ("
                                   "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                                   "user_id INTEGER, "
                                   "title TEXT NOT NULL, "
                                   "category TEXT NOT NULL, "
                                   "quantity TEXT NOT NULL, "
                                   "price TEXT, "
                                   "listing_type TEXT NOT NULL, "
                                   "barangay TEXT NOT NULL, "
                                   "description TEXT, "
                                   "image TEXT, "
                                   "created_at DATETIME DEFAULT CURRENT_TIMESTAMP, "
                                   "FOREIGN KEY(user_id) REFERENCES users(id));";

        const char* sqlInquiries = "CREATE TABLE IF NOT EXISTS inquiries ("
                                   "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                                   "material_id INTEGER, "
                                   "sender_name TEXT NOT NULL, "
                                   "sender_contact TEXT NOT NULL, "
                                   "message TEXT NOT NULL, "
                                   "FOREIGN KEY(material_id) REFERENCES materials(id));";

        char* errMsg = nullptr;
        sqlite3_exec(db, sqlUsers, nullptr, nullptr, &errMsg);
        sqlite3_exec(db, sqlMaterials, nullptr, nullptr, &errMsg);
        sqlite3_exec(db, sqlInquiries, nullptr, nullptr, &errMsg);
    }

    sqlite3* getConnection() { return db; }
};

#endif
