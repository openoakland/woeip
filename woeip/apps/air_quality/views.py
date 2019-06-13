import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views import View
from django.utils.encoding import force_text

from .forms import SessionDataForm
from .models import SessionData

logger = logging.getLogger(__name__)
# TODO: Document complete re-write of the view
class Upload(LoginRequiredMixin, View):
    def get(self, request):
        ## TODO: copy view from ty/drag-drop branch
        return render(self.request, 'air_quality/upload.html', {
            'form' : SessionDataForm
        })

    def post(self, request):
        files = self.request.FILES
        form = SessionDataForm(self.request.POST, files)
        if form.is_valid():
            form.save()
            return redirect('view_session_data')
        else:
            messages.add_message(self.request, messages.ERROR, 'File upload error')
            return redirect('upload')

class ViewSessionData(View):
    # TODO: Docstring intention of view
    # TODO: Document why view is already created
    def get(self, request):
        # sessionData_list = SessionData.objects.all().delete()
        sessionData_list = SessionData.objects.all()
        return render(self.request, 'air_quality/view_data.html', {
            'sessionData': sessionData_list
        })
