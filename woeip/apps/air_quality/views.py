import logging

from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views import View
from django.utils.encoding import force_text

from .forms import SessionDataForm
from .models import SessionData

logger = logging.getLogger(__name__)

class Upload(LoginRequiredMixin, View):
    def get(self, request):
        ## TODO: copy view from ty/drag-drop branch
        ## TODO: make migrations
        documents_list = ""