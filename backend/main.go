package main

import (
	"backend/AllRoutes"
	"backend/database"
	"backend/middleware"
	"backend/routes"
	"log"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	port := "8080"
	app := AllRoutes.NewApplication(database.ProductData(database.Client, "Products"), database.UserData(database.Client, "Users"))
	router := gin.Default()
	router.Use(cors.AllowAll())
	router.Use(gin.Logger())
	routes.UserRoutes(router)
	router.Use(middleware.Authentication())
	router.POST("/api/UserAddtocart", app.AddToCart())
	router.POST("/UserAddtowishlist", app.AddToWishlist())
	router.DELETE("/userremoveitem", app.RemoveItem())
	router.DELETE("/userremovewishitem", app.RemoveWishItem())
	router.GET("/Usergetwishlist", AllRoutes.GetItemFromWish())
	router.GET("/Usercart", AllRoutes.GetItemFromCart())
	router.GET("/UserWishlist", AllRoutes.GetItemFromCart())
	router.POST("/addaddress", AllRoutes.AddAddress())
	router.PUT("/edithomeaddress", AllRoutes.EditHomeAddress())
	log.Fatal(router.Run(":" + port))
}
