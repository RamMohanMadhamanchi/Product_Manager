package routes

import (
	"backend/AllRoutes"

	"github.com/gin-gonic/gin"
)

func UserRoutes(RequestRoutes *gin.Engine) {
	RequestRoutes.POST("/api/user/signup", AllRoutes.UserSignUp())
	RequestRoutes.POST("/api/user/signin", AllRoutes.UserLogin())
	RequestRoutes.POST("api/seller/addproduct", AllRoutes.ProductViewerSeller())
	RequestRoutes.GET("api/products", AllRoutes.GettingProducts())
}
