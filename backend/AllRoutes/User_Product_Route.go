package AllRoutes

import (
	"backend/database"
	"backend/models"
	generate "backend/tokens"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var UserCollection *mongo.Collection = database.UserData(database.Client, "Users")
var ProductCollection *mongo.Collection = database.ProductData(database.Client, "Products")
var Validate = validator.New()

func HashingPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userpassword string, givenpassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(givenpassword), []byte(userpassword))
	valid_User := true
	msg := ""
	if err != nil {
		msg = "User enter email or password wrong"
		valid_User = false
	}
	return valid_User, msg
}

func UserSignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		var user models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": err.Error()})
			return
		}
		validationErr := Validate.Struct(user)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": validationErr})
			return
		}

		count, err := UserCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"status": err, "m": "m"})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "message": "User already exists!!! Please change the Email ID"})
			return
		}
		count, err = UserCollection.CountDocuments(ctx, bson.M{"phone": user.Phone})
		defer cancel()
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "message": "User already exists!!! Please change the Phone number"})
			return
		}
		// It doesn't make sense to hash the password while still checking if
		// the phone number exists or not. So I moved it down a bit.
		password := HashingPassword(*user.Password)
		user.Password = &password
		token, _ := generate.TokenGenerator(*user.Email, *user.Full_Name, user.User_ID)
		user.Token = &token

		user.Created_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

		user.ID = primitive.NewObjectID()
		user.User_ID = user.ID.Hex()
		user.Updated_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.UserCart = make([]models.ProductUser, 0)
		user.Wishlist = make([]models.WishlistUser, 0)
		user.Address_Details = make([]models.Address, 0)
		_, addingusererr := UserCollection.InsertOne(ctx, user)
		if addingusererr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "error while registrations"})
			return
		}
		defer cancel()
		c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "User successfully Registered"})
	}
}

//user login and update token
func UserLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		var user models.User
		var founduser models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		err := UserCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&founduser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "User does not Exist!!! Please Sign Up"})
			return
		}
		PasswordIsValid, msg := VerifyPassword(*user.Password, *founduser.Password)
		defer cancel()
		if !PasswordIsValid {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Password is incorrect"})
			fmt.Println(msg)
			return
		}
		token, _ := generate.TokenGenerator(*founduser.Email, *founduser.Full_Name, founduser.User_ID)

		founduser.Token = &token
		generate.UpdateToken(token, founduser.User_ID)
		c.IndentedJSON(200, founduser)
	}
}

func ProductViewerSeller() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var products models.Product
		defer cancel()
		if err := c.BindJSON(&products); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		products.Product_ID = primitive.NewObjectID()
		_, anyerr := ProductCollection.InsertOne(ctx, products)
		if anyerr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Not Created"})
			return
		}
		defer cancel()
		c.JSON(http.StatusOK, "Successfully added our Product Admin!!")
	}
}

// searching products inside user database
func GettingProducts() gin.HandlerFunc {
	return func(c *gin.Context) {
		var productlist []models.Product
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		products, err := ProductCollection.Find(ctx, bson.D{{}})
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, "Someting Went Wrong Please Try After Some Time")
			return
		}
		err = products.All(ctx, &productlist)
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		defer products.Close(ctx)
		if err := products.Err(); err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return
		}
		defer cancel()
		c.IndentedJSON(200, productlist)

	}
}
