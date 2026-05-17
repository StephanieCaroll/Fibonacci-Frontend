# Descrição desse tópico: Aceita dados complexos iguais a query,models,instâncias.
#manipulação dos Models.
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User  
from .models import Product, Order, OrderItem, Review, ShippingAddress, Category, ProductImage, Comment

class UserSerializer(serializers.ModelSerializer):
    
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User  
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    
    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):  
        return obj.is_staff

    def get_name(self, obj):  
        name = obj.first_name
        if name == "":
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta: 
        model = User 
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']
    
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'product', 'user', 'username', 'email', 'content', 'created']

    def get_username(self, obj):
        if obj.user:
            return obj.user.username
        return "Usuário Anônimo"


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)

    class Meta: 
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        return ReviewSerializer(reviews, many=True).data

    def get_comments(self, obj):
        comments = obj.comments.all()  # Puxa os comentários vinculados ao produto
        return CommentSerializer(comments, many=True).data
    
    

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    
    product_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'order', 'name', 'qty', 'price', 'image']

    def get_product_details(self, obj):
        if obj.product:
            return {"name": obj.product.name, "price": str(obj.product.price)}
        return None


class OrderSerializer(serializers.ModelSerializer):
    
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
     
        items = obj.orderitem_set.all()
        return OrderItemSerializer(items, many=True).data

    def get_shippingAddress(self, obj):
        try:
            
            address = obj.shippingaddress 
            return ShippingAddressSerializer(address, many=False).data
        except:
            
            return None

    def get_user_details(self, obj):
        if obj.user:
            return UserSerializer(obj.user, many=False).data
        return None
    
    from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ArtistProfile # certifique-se de importar o novo modelo

class ArtistProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistProfile
        fields = ['is_artist', 'location', 'bio', 'profile_image', 'banner_image', 'instagram', 'facebook', 'twitter']

class ArtistListSerializer(serializers.ModelSerializer):
    # Puxa os dados do perfil estendido automaticamente
    profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile']

    def get_profile(self, obj):
        try:
            # Tenta buscar o perfil do artista vinculado ao usuário
            profile = obj.artist_profile
            return ArtistProfileSerializer(profile, many=False).data
        except:
            return None