from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        if self.request.user.role != 'ADMIN':
            return User.objects.none()
        return super().get_queryset()

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role != 'ADMIN':
            self.permission_denied(request, message='Only Admins can perform this action.')
