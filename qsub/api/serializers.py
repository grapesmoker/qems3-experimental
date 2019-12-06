from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

User = get_user_model()


from qsub.models import (Tossup, Bonus, Packet, Distribution, DistributionEntry, DistributionPerPacket,
                         SetWideDistributionEntry, TieBreakDistributionEntry, QuestionSet,
                         QuestionType, QuestionFieldHistory, QuestionHistory, Writer, WriterQuestionSetSettings,
                         PerCategoryWriterSettings, CategoryEntry, Category)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class WriterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Writer
        fields = ['user', 'administrator', 'send_mail_on_comments']


class QuestionSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionSet
        fields = ['name', 'date', 'host', 'address', 'owner', 'public',
                  'num_packets', 'distribution', 'tiebreak_dist',
                  'max_acf_tossup_length', 'max_acf_bonus_length',
                  'max_vhsl_bonus_length', 'char_count_ignores_pronunciation_guides']


class PacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packet
        fields = ['packet_name', 'date_submitted', 'question_set', 'created_by']


class DistributionPerPacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionPerPacket
        fields = ['question_set', 'category', 'subcategory', 'num_tossups', 'num_bonuses']


class DistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribution
        fields = ['id', 'name', 'tossups_per_packet', 'bonuses_per_packet']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'parent_category', 'path', 'subcategories']

    def get_fields(self):
        fields = super().get_fields()
        fields['subcategories'] = CategorySerializer(many=True, required=False)
        return fields


class CategoryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryEntry
        fields = ['distribution', 'category_name', 'sub_category_name', 'sub_sub_category_name',
                  'category_type', 'acf_tossup_fraction', 'acf_bonus_fraction', 'vhsl_bonus_fraction',
                  'min_total_questions_in_period', 'max_total_questions_in_period']


class DistributionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionEntry
        fields = ['distribution', 'category', 'subcategory', 'min_tossups', 'max_tossups', 'min_bonuses', 'max_bonuses']


class TieBreakDistributionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TieBreakDistributionEntry
        fields = ['question_set', 'dist_entry', 'num_tossups', 'num_bonuses']


class SetWideDistributionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SetWideDistributionEntry
        fields = ['question_set', 'dist_entry', 'num_tossups', 'num_bonuses']


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = ['question_type']


class QuestionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionHistory
        fields = ['modified_by', 'content_object', 'modified_on']


class QuestionFieldHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionFieldHistory
        fields = ['modified_field', 'changed_from', 'changed_to', 'question_history']


class WriterQuestionSetSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WriterQuestionSetSettings
        fields = ['writer', 'question_set', 'email_on_all_new_comments', 'email_on_all_new_questions']


class PerCategoryWriterSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerCategoryWriterSettings
        fields = ['writer_question_set_settings', 'distribution_entry',
                  'email_on_new_questions', 'email_on_new_comments']


class TossupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tossup
        fields = ['packet', 'question_set', 'tossup_text', 'tossup_answer', 'category', 'subtype',
                  'time_period', 'location', 'question_type', 'author', 'locked', 'edited',
                  'question_number', 'editor']


class BonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bonus
        fields = ['leadin', 'part1_text', 'part1_answer', 'part2_text', 'part2_answer', 'part3_text', 'part3_answer',
                  'category', 'subtype', 'time_period', 'location', 'question_type', 'author', 'locked', 'edited',
                  'question_number', 'editor']
