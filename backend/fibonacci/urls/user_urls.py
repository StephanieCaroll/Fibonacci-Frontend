from django.urls import path 

from fibonacci.views import user_views as views

#Aqui fica o acesso e funções.
urlpatterns = [
    path('register/', views.registerUser,name='register'),
    path('profile/',views.getUserProfile,name="user_profile"),
    path('profile/update', views.updateUserProfile,name="user_profile_updates"),
    path('login/', views.MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('delete/<str:pk>/',views.deleteUser,name="deleteUser"),
    path('artists/', views.getArtists, name='artists-list'),
    path('artists/<str:pk>/', views.getArtistProfileAndProducts, name='artist-detail-portfolio'),
]





