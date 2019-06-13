import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.views import View

from .forms import SessionDataForm
from .models import SessionData

logger = logging.getLogger(__name__)


class Upload(LoginRequiredMixin, View):
    def get(self, request):
        """Present file upload form to user"""
        return render(self.request, 'air_quality/upload.html', {
            'form': SessionDataForm
        })

    def post(self, request):
        """Save files to SessionData table"""
        files = self.request.FILES
        form = SessionDataForm(self.request.POST, files)
        if form.is_valid():
            form.save()
            path = redirect('view_session_data')
        else:
            messages.add_message(self.request, messages.ERROR, 'File upload error')
            path = redirect('upload')
        return path


class ViewSessionData(View):
    """Provide temporary development page to view all uploaded SessionDatas."""
    def get(self, request):
        sessionData_list = SessionData.objects.all()
        return render(self.request, 'air_quality/view_data.html', {
            'sessionData': sessionData_list
        })
