from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, ProfileView, UserListView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('users/', UserListView.as_view(), name='admin_users_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='admin_user_detail'),
]
