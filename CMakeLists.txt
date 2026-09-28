cmake_minimum_required(VERSION 3.14)
project(TaclobanMarketplaceBackend)

set(CMAKE_CXX_STANDARD 17)

# Find SQLite3 package
find_package(SQLite3 REQUIRED)

# Fetch Crow C++ micro-framework
include(FetchContent)
FetchContent_Declare(
  Crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG v1.2.0
)
FetchContent_MakeAvailable(Crow)

add_executable(marketplace_server main.cpp)

target_link_libraries(marketplace_server PRIVATE Crow::Crow SQLite::SQLite3 pthread dl)
