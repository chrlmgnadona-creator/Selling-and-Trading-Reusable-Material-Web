#define CROW_MAIN
#include "crow.h"
#include "database.hpp"
#include <iostream>

int main() {
    crow::SimpleApp app;
    Database db("marketplace.db");

    // Middleware for CORS headers
    #CROW_ROUTE(app, "/api/materials").methods("OPTIONS"_method)([]() {
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        return res;
    });

    // Get All Materials Endpoint
    CROW_ROUTE(app, "/api/materials").methods("GET"_method)([&db](const crow::request& req) {
        sqlite3* conn = db.getConnection();
        sqlite3_stmt* stmt;
        std::string query = "SELECT materials.id, materials.title, materials.category, materials.quantity, "
                            "materials.price, materials.listing_type, materials.barangay, materials.description, "
                            "materials.image, users.name as seller_name, users.phone as seller_phone "
                            "FROM materials JOIN users ON materials.user_id = users.id ORDER BY materials.created_at DESC;";

        crow::json::wdoc resultJson;
        std::vector<crow::json::rvalue> items;

        if (sqlite3_prepare_v2(conn, query.c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
            int i = 0;
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                crow::json::wdoc item;
                item["id"] = sqlite3_column_int(stmt, 0);
                item["title"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
                item["category"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
                item["quantity"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
                item["price"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4));
                item["listing_type"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 5));
                item["barangay"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 6));
                item["description"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 7));
                item["image"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 8));
                item["seller_name"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 9));
                item["seller_phone"] = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 10));
                
                // For simplicity in C++ response vector building
                items.push_back(item.dump());
                i++;
            }
            sqlite3_finalize(stmt);
        }

        crow::response res;
        res.code = 200;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.set_header("Content-Type", "application/json");
        
        // Return JSON array
        std::string jsonStr = "[";
        for(size_t j = 0; j < items.size(); ++j) {
            jsonStr += items[j].s();
            if(j + 1 < items.size()) jsonStr += ",";
        }
        jsonStr += "]";
        res.body = jsonStr;
        return res;
    });

    // Register User Endpoint
    CROW_ROUTE(app, "/api/auth/register").methods("POST"_method)([&db](const crow::request& req) {
        auto x = crow::json::load(req.body);
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");

        if (!x) {
            res.code = 400;
            res.body = "{\"error\": \"Invalid JSON payload\"}";
            return res;
        }

        std::string name = x["name"].s();
        std::string email = x["email"].s();
        std::string password = x["password"].s();
        std::string barangay = x["barangay"].s();
        std::string phone = x.has("phone") ? x["phone"].s() : "";

        sqlite3* conn = db.getConnection();
        std::string sql = "INSERT INTO users (name, email, password, barangay, phone) VALUES (?, ?, ?, ?, ?);";
        sqlite3_stmt* stmt;

        if (sqlite3_prepare_v2(conn, sql.c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, name.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 2, email.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 3, password.c_str(), -1, SQLITE_STATIC); // Note: Hash in production
            sqlite3_bind_text(stmt, 4, barangay.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 5, phone.c_str(), -1, SQLITE_STATIC);

            if (sqlite3_step(stmt) == SQLITE_DONE) {
                res.code = 200;
                res.body = "{\"message\": \"Registration successful\"}";
            } else {
                res.code = 400;
                res.body = "{\"error\": \"Email already registered or invalid data\"}";
            }
            sqlite3_finalize(stmt);
        } else {
            res.code = 500;
            res.body = "{\"error\": \"Database error\"}";
        }
        return res;
    });

    std::cout << "LGU Tacloban C++ Marketplace Backend running on http://localhost:8080...\n";
    app.port(8080).multithreaded().run();
    return 0;
}
