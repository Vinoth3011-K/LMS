from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'name', 'email', 'role', 'profile_image', 'created_at', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.get('role', User.Role.STUDENT)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            role=role
        )
        
        if role == User.Role.ADMIN:
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
