import json
import os

from django.conf import settings

from rest_framework.authentication import TokenAuthentication, SessionAuthentication, BasicAuthentication
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes, action
from rest_framework import viewsets
from rest_framework_extensions.mixins import NestedViewSetMixin
from rest_framework.exceptions import ParseError

from qsub.models import (Tossup, Bonus, QuestionSet, Packet, Distribution, DistributionEntry,
                         DistributionPerPacket, TieBreakDistributionEntry)
from qsub.api.serializers import (TossupSerializer, BonusSerializer, QuestionSetSerializer)


class BaseNestedModelViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated, )

    def get_serializer(self, *args, **kwargs):
        if 'data' in kwargs:
            data = kwargs['data']
            if isinstance(data, list):
                kwargs['many'] = True
        return super(BaseNestedModelViewSet, self).get_serializer(*args, **kwargs)


class TossupViewSet(BaseNestedModelViewSet):

    model = Tossup
    queryset = Tossup.objects.all()
    serializer_class = TossupSerializer


class BonusViewSet(BaseNestedModelViewSet):

    model = Bonus
    queryset = Bonus.objects.all()
    serializer_class = BonusSerializer


class QuestionSetViewSet(BaseNestedModelViewSet):

    model = QuestionSet
    queryset = QuestionSet.objects.all()
    serializer_class = QuestionSetSerializer

