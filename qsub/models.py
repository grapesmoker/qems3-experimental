from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib import messages

from allauth.account.signals import password_changed

from qsub.config.distribution import *
from qsub.validation.tossups import InvalidTossup
from qsub.validation.bonuses import InvalidBonus
from qsub.utils.formatting import TossupFormatterMixin, BonusFormattedMixin


class Writer(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    question_set_writer = models.ManyToManyField('QuestionSet', related_name='writer')
    question_set_editor = models.ManyToManyField('QuestionSet', related_name='editor')

    administrator = models.BooleanField(null=False, default=False)
    send_mail_on_comments = models.BooleanField(null=False, default=False)

    def get_real_name(self):
        return '{0!s} {1!s} '.format(self.user.first_name, self.user.last_name)

    def get_last_name(self):
        return self.user.last_name

    def __str__(self):
        return '{0!s} {1!s} ({2!s})'.format(self.user.first_name, self.user.last_name, self.user.username)


class QuestionSet (models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    host = models.CharField(max_length=200)
    address = models.TextField(max_length=200)
    owner = models.ForeignKey('Writer', related_name='owner', on_delete=models.CASCADE)
    public = models.BooleanField(null=False, default=False)
    num_packets = models.PositiveIntegerField()
    distribution = models.ForeignKey('Distribution', null=True, on_delete=models.SET_NULL,
                                     related_name='distribution')
    tiebreak_dist = models.ForeignKey('Distribution', null=True, on_delete=models.SET_NULL,
                                      related_name='tiebreak_dist')

    max_acf_tossup_length = models.PositiveIntegerField(default=750)
    max_acf_bonus_length = models.PositiveIntegerField(default=400)
    max_vhsl_bonus_length = models.PositiveIntegerField(default=100)
    char_count_ignores_pronunciation_guides = models.BooleanField(default=True)

    class Admin:
        pass

    def __str__(self):
        return '{0!s}'.format(self.name)


class Role(models.Model):

    writer = models.ForeignKey(Writer, on_delete=models.CASCADE)
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE)
    category = models.CharField(max_length=500)
    can_view_others = models.BooleanField(null=False, default=False)
    can_edit_others = models.BooleanField(null=False, default=False)


class Packet(models.Model):
    packet_name = models.CharField(max_length=200)
    date_submitted = models.DateField(auto_now_add=True)
    question_set = models.ForeignKey(QuestionSet, null=True, on_delete=models.SET_NULL)

    created_by = models.ForeignKey(Writer, related_name='packet_creator', null=True,
                                   on_delete=models.SET_NULL)

    def __str__(self):
        return '{0!s}'.format(self.packet_name)


class DistributionPerPacket(models.Model):
    # packet = models.ManyToManyField(Packet)

    question_set = models.ManyToManyField(QuestionSet)
    category = models.CharField(max_length=10, choices=CATEGORIES)
    subcategory = models.CharField(max_length=10)
    num_tossups = models.PositiveIntegerField()
    num_bonuses = models.PositiveIntegerField()


class Distribution(models.Model):
    name = models.CharField(max_length=100)
    acf_tossup_per_period_count = models.PositiveIntegerField(default=20)
    acf_bonus_per_period_count = models.PositiveIntegerField(default=20)
    vhsl_bonus_per_period_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return '{0!s}'.format(self.name)


# This class corresponds to a distribution and appears in multiple sets
# Contains no set-specific information, but does contain info on absolute
# number of tossups (rather than percentages)
class CategoryEntry(models.Model):
    distribution = models.ForeignKey(Distribution, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=200)
    sub_category_name = models.CharField(max_length=200, null=True)
    sub_sub_category_name = models.CharField(max_length=200, null=True)
    category_type = models.CharField(max_length=200, choices=(('Category', 'Category'),
                                                              ('SubCategory', 'Subcategory'),
                                                              ('SubSubCategory', 'SubSubCategory')))

    # Min/max questions of this type for one period
    # i.e. 2.2, which means between 2 and 3 weighted towards 2
    acf_tossup_fraction = models.DecimalField(null=True, max_digits=5, decimal_places=1)
    acf_bonus_fraction = models.DecimalField(null=True, max_digits=5, decimal_places=1)
    vhsl_bonus_fraction = models.DecimalField(null=True, max_digits=5, decimal_places=1)

    # Min/max questions of all types in one period for this category
    min_total_questions_in_period = models.PositiveIntegerField(null=True)
    max_total_questions_in_period = models.PositiveIntegerField(null=True)

    def get_acf_tossup_integer(self):
        return int(self.acf_tossup_fraction)

    def get_acf_tossup_remainder(self):
        return self.acf_tossup_fraction - self.get_acf_tossup_integer()

    def get_acf_bonus_integer(self):
        return int(self.acf_bonus_fraction)

    def get_acf_bonus_remainder(self):
        return self.acf_bonus_fraction - self.get_acf_bonus_integer()

    def get_vhsl_bonus_integer(self):
        return int(self.vhsl_bonus_fraction)

    def get_vhsl_bonus_remainder(self):
        return self.vhsl_bonus_fraction - self.get_vhsl_bonus_integer()

    def __str__(self):
        if (self.sub_sub_category_name is not None):
            return '{0!s} - {1!s} - {2!s}'.format(self.category_name, self.sub_category_name,
                                                  self.sub_sub_category_name)
        elif (self.sub_category_name is not None):
            return '{0!s} - {1!s}'.format(self.category_name, self.sub_category_name)
        else:
            return '{0!s}'.format(self.category_name)


class DistributionEntry(models.Model):
    distribution = models.ForeignKey(Distribution, on_delete=models.CASCADE)
    category = models.TextField()
    subcategory = models.TextField()
    min_tossups = models.PositiveIntegerField(null=True)
    min_bonuses = models.PositiveIntegerField(null=True)
    max_tossups = models.PositiveIntegerField(null=True)
    max_bonuses = models.PositiveIntegerField(null=True)

    # fin_tossups = models.CharField(max_length=500, null=True)
    # fin_bonuses = models.CharField(max_length=500, null=True)

    def __str__(self):
        return '{0!s} - {1!s}'.format(self.category, self.subcategory)


class TieBreakDistributionEntry(models.Model):
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE)
    dist_entry = models.ForeignKey(DistributionEntry, on_delete=models.CASCADE)
    num_tossups = models.PositiveIntegerField(null=True)
    num_bonuses = models.PositiveIntegerField(null=True)

    def __str__(self):
        return '{0!s} - {1!s}'.format(self.dist_entry.category, self.dist_entry.subcategory)


class SetWideDistributionEntry(models.Model):
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE)
    dist_entry = models.ForeignKey(DistributionEntry, on_delete=models.CASCADE)
    num_tossups = models.PositiveIntegerField()
    num_bonuses = models.PositiveIntegerField()

    def __str__(self):
        return '{0!s} - {1!s}'.format(self.dist_entry.category, self.dist_entry.subcategory)


class QuestionType(models.Model):
    question_type = models.CharField(max_length=500)

    def __unicode__(self):
        return '{0!s}'.format(self.question_type)


class QuestionHistory(models.Model):

    modified_by = models.ForeignKey(Writer, null=True, on_delete=models.SET_NULL)
    limit = models.Q(app_label='qsub', model='tossup') | models.Q(app_label='qsub', model='bonus')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, limit_choices_to=limit)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    modified_on = models.DateTimeField()


class QuestionFieldHistory(models.Model):

    modified_field = models.CharField(max_length=255)
    changed_from = models.TextField()
    changed_to = models.TextField()
    question_history = models.ForeignKey(QuestionHistory, on_delete=models.CASCADE)


class Tossup(models.Model, TossupFormatterMixin):
    packet = models.ForeignKey(Packet, null=True, on_delete=models.SET_NULL)
    question_set = models.ForeignKey(QuestionSet, null=True, on_delete=models.CASCADE)
    tossup_text = models.TextField()
    tossup_answer = models.TextField()

    category = models.ForeignKey(DistributionEntry, null=True, on_delete=models.SET_NULL)
    subtype = models.CharField(max_length=500)
    time_period = models.CharField(max_length=500)
    location = models.CharField(max_length=500)
    question_type = models.ForeignKey(QuestionType, null=True, on_delete=models.SET_NULL)
    author = models.ForeignKey(Writer, null=True, on_delete=models.SET_NULL)

    locked = models.BooleanField(default=False)
    edited = models.BooleanField(default=False)

    # order = models.PositiveIntegerField(null=True)
    question_number = models.PositiveIntegerField(null=True)

    search_question_content = models.TextField(default='')
    search_question_answers = models.TextField(default='')
    editor = models.ForeignKey(Writer, null=True, related_name='tossup_editor', on_delete=models.SET_NULL)

    # Calculates character count, ignoring special characters
    def character_count(self):
        if self.question_set:
            return self.get_character_count(self.tossup_text,
                                            self.question_set.char_count_ignores_pronunciation_guides)
        return self.get_character_count(self.tossup_text)

    def save(self, *args, **kwargs):
        self.setup_search_fields()
        super(Tossup, self).save(*args, **kwargs)

    def __unicode__(self):
        return '{0!s}...'.format(self.strip_markup(self.tossup_answer)[0:40])  # .decode('utf-8')

    # functions moved to serializer

    def is_valid(self):

        if self.tossup_text == '':
            raise InvalidTossup('question', self.tossup_text, self.question_number)

        if self.tossup_answer == '':
            raise InvalidTossup('answer', self.tossup_answer, self.question_number)

        if not self.are_special_characters_balanced(self.tossup_text):
            raise InvalidTossup('question', self.tossup_text, self.question_number)

        if not self.are_special_characters_balanced(self.tossup_answer):
            raise InvalidTossup('answer', self.tossup_answer, self.question_number)

        if not self.does_answerline_have_underlines(self.tossup_answer):
            raise InvalidTossup('answer', self.tossup_answer, self.question_number)

        return True

    def setup_search_fields(self, remove_unicode=True):
        self.search_question_content = self.strip_special_chars(self.tossup_text)
        self.search_question_answers = self.strip_special_chars(self.tossup_answer)

    def get_tossup_type(self):
        return self.get_tossup_type_from_question_type(self.question_type)


class Bonus(models.Model, BonusFormattedMixin):
    packet = models.ForeignKey(Packet, null=True, on_delete=models.SET_NULL)
    question_set = models.ForeignKey(QuestionSet, null=True, on_delete=models.SET_NULL)

    # Leadins and part 2 and 3 aren't required in VHSL, so allow nulls
    # The is_valid method will make sure that ACF bonuses have these values
    leadin = models.TextField(null=True)
    part1_text = models.TextField(null=True)
    part1_answer = models.TextField(null=True)
    part2_text = models.TextField(null=True)
    part2_answer = models.TextField(null=True)
    part3_text = models.TextField(null=True)
    part3_answer = models.TextField(null=True)

    category = models.ForeignKey(DistributionEntry, null=True, on_delete=models.SET_NULL)
    subtype = models.CharField(max_length=500)
    time_period = models.CharField(max_length=500)
    location = models.CharField(max_length=500)
    question_type = models.ForeignKey(QuestionType, null=True, on_delete=models.SET_NULL)

    author = models.ForeignKey(Writer, null=True, on_delete=models.SET_NULL)

    locked = models.BooleanField(default=False)
    edited = models.BooleanField(default=False)

    question_number = models.PositiveIntegerField(null=True)

    search_question_content = models.TextField(default='')
    search_question_answers = models.TextField(default='')

    editor = models.ForeignKey(Writer, null=True, related_name='bonus_editor', on_delete=models.SET_NULL)

    # Calculates character count, ignoring special characters
    @property
    def character_count(self):
        char_count_ignores_pronunciation_guides = True
        if self.question_set:
            char_count_ignores_pronunciation_guides = self.question_set.char_count_ignores_pronunciation_guides

        leadin_count = self.get_character_count(self.leadin, char_count_ignores_pronunciation_guides)
        part1_count = self.get_character_count(self.part1_text, char_count_ignores_pronunciation_guides)
        part2_count = self.get_character_count(self.part2_text, char_count_ignores_pronunciation_guides)
        part3_count = self.get_character_count(self.part3_text, char_count_ignores_pronunciation_guides)
        return leadin_count + part1_count + part2_count + part3_count

    def __unicode__(self):
        if self.get_bonus_type() == self.ACF_STYLE_BONUS:
            return '{0!s}...'.format(self.strip_markup(
                self.get_answer_no_formatting(self.part1_answer))[0:40])
        else:
            return '{0!s}...'.format(self.strip_markup(
                self.get_answer_no_formatting(self.part1_answer))[0:40])

    def is_valid(self):

        if self.get_bonus_type() == self.ACF_STYLE_BONUS:

            if self.leadin == '':
                raise InvalidBonus('leadin', self.leadin, self.question_number)

            if not self.are_special_characters_balanced(self.leadin):
                raise InvalidBonus('leadin', self.leadin, self.question_number)

            answers = [self.part1_answer, self.part2_answer, self.part3_answer]
            for answer in answers:
                if not self.are_special_characters_balanced(answer):
                    raise InvalidBonus('answers', answer, self.question_number)
                if not self.does_answerline_have_underlines(answer):
                    raise InvalidBonus('answers', answer, self.question_number)

            parts = [self.part1_text, self.part2_text, self.part3_text]
            for part in parts:
                if part == '':
                    raise InvalidBonus('parts', part, self.question_number)
                if not self.are_special_characters_balanced(part):
                    raise InvalidBonus('parts', part, self.question_number)

            return True

        elif self.get_bonus_type() == self.VHSL_BONUS:

            if self.leadin is not None and self.leadin != '':
                raise InvalidBonus('leadin', self.leadin + " (this field should be blank for VHSL bonuses.)",
                                   self.question_number)
            blank_parts = [self.part2_text, self.part2_answer, self.part3_text, self.part3_answer]
            for blank_part in blank_parts:
                if (blank_part is not None and blank_part != ''):
                    raise InvalidBonus('2nd or 3rd part of bonus (this field should be blank for VHSL bonuses.)',
                                       blank_part, self.question_number)

            answers = [self.part1_answer]
            for answer in answers:
                if not self.are_special_characters_balanced(answer):
                    raise InvalidBonus('answer', answer, self.question_number)
                if not self.does_answerline_have_underlines(answer):
                    raise InvalidBonus('answer', answer, self.question_number)

            parts = [self.part1_text]
            for part in parts:
                if part == '':
                    raise InvalidBonus('part', part, self.question_number)
                if not self.are_special_characters_balanced(part):
                    raise InvalidBonus('part', part, self.question_number)

            return True

        else:
            raise InvalidBonus('question_type', self.question_type, self.question_number)

    def get_bonus_type(self):
        return self.get_bonus_type_from_question_type(self.question_type)


class Tag(models.Model):
    pass


class WriterQuestionSetSettings(models.Model):
    writer = models.ForeignKey(Writer, on_delete=models.CASCADE)
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE)
    email_on_all_new_comments = models.BooleanField(default=False)
    email_on_all_new_questions = models.BooleanField(default=False)

    # Creates new per category writer settings for this object
    def create_per_category_writer_settings(self):
        for de in self.question_set.distribution.distributionentry_set.all():
            pcws = PerCategoryWriterSettings(writer_question_set_settings=self, distribution_entry=de)
            pcws.save()


class PerCategoryWriterSettings(models.Model):
    writer_question_set_settings = models.ForeignKey(WriterQuestionSetSettings, on_delete=models.CASCADE)
    distribution_entry = models.ForeignKey(DistributionEntry, on_delete=models.CASCADE)
    email_on_new_questions = models.BooleanField(default=False)
    email_on_new_comments = models.BooleanField(default=False)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Writer.objects.create(user=instance)


@receiver(password_changed)
def password_change_callback(sender, request, user, **kwargs):
    messages.success(request, 'You have Successfully changed your Password!')


post_save.connect(create_user_profile, sender=User)


