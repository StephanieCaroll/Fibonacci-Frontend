from django.shortcuts import render
from django.contrib.auth.models import User 
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from fibonacci.models import *
from fibonacci.serializers import UserSerializer, UserSerializerWithToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Injeta os dados customizados do usuário no retorno do login
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v 
        return data 

    @classmethod
    def get_token(cls, user):
        token = super().get_token(cls, user)
        token['username'] = user.username  
        token['message'] = "Projeto Galeria de Artes"
        return token
    

class MyTokenObtainPairView(TokenObtainPairView):  
    serializer_class = MyTokenObtainPairSerializer  




@api_view(['GET'])  
def getRoutes(request):
    routes = [
        '/fibonacci/products',
        '/fibonacci/products/<id>',
        '/fibonacci/users',
        '/fibonacci/users/register',
        '/fibonacci/users/login',
        '/fibonacci/users/profile',
    ]
    return Response(routes)


@api_view(['POST'])  
def registerUser(request):
    data = request.data
    try:
        
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    
    except Exception as e:  
        message = {"detail": "User with this email is already registered"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['GET'])  
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):  
    user = request.user 
    data = request.data
    
    
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    
    
    if data['password'] != "":
        user.password = make_password(data['password'])
        
    
    user.save()
    
   
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

    
@api_view(['DELETE'])
def deleteUser(request, pk):
    try:
        userForDeletion = User.objects.get(id=pk)
        userForDeletion.delete()
        
        return Response({'detail': 'Usuário deletado com sucesso'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from fibonacci.models import Product
from fibonacci.serializers import ArtistListSerializer, ProductSerializer

@api_view(['GET'])
def getArtists(request):
    # Busca apenas os usuários que possuem perfil de artista ativo
    artists = User.objects.filter(artist_profile__is_artist=True)
    serializer = ArtistListSerializer(artists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getArtistProfileAndProducts(request, pk):
    try:
        # Busca o usuário/artista pelo ID
        artist = User.objects.get(id=pk)
        artist_serializer = ArtistListSerializer(artist, many=False)
        
        # Busca apenas as obras de arte que pertencem a ESSE artista especificamente
        products = Product.objects.filter(user=artist)
        products_serializer = ProductSerializer(products, many=True)
        
        # Envia um "pacote" completo para o React ler de uma vez só
        return Response({
            'artist': artist_serializer.data,
            'products': products_serializer.data
        })
    except User.DoesNotExist:
        return Response({'detail': 'Artista não encontrado'}, status=404)
    
    












