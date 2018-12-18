import unicodedata

from bs4 import BeautifulSoup
from django.utils.safestring import mark_safe
from django.utils.encoding import smart_text

# translation mapping table that converts
# single smart quote characters to standard
# single quotes
SINGLE_QUOTE_MAP = {
        0x2018: 39,
        0x2019: 39,
        0x201A: 39,
        0x201B: 39,
        0x2039: 39,
        0x203A: 39,
}

# translation mapping table that converts
# double smart quote characters to standard
# double quotes
DOUBLE_QUOTE_MAP = {
        0x00AB: 34,
        0x00BB: 34,
        0x201C: 34,
        0x201D: 34,
        0x201E: 34,
        0x201F: 34,
}


class FormatterMixin(object):

    @staticmethod
    def convert_smart_quotes(line):
        return smart_text(line).translate(DOUBLE_QUOTE_MAP).translate(SINGLE_QUOTE_MAP)

    def strip_markup(self, html):
        html = self.convert_smart_quotes(html)
        html = html.replace("&", "&amp;")
        soup = BeautifulSoup(html)
        return soup.get_text()

    @staticmethod
    def get_primary_answer(line):

        if line is None:
            return ''

        index = line.lower().find("[")
        if index >= 0:
            return line[:index]
        else:
            return line

    @staticmethod
    def preview(text):
        if text is None:
            return ''

        if len(text) > 81:
            return mark_safe(text[0:81] + '...')
        else:
            return mark_safe(text)

    def get_formatted_question_html(self, line, **kwargs):
        italics_flag = False
        parens_flag = False
        underline_flag = False
        need_to_restore_italics_flag = False
        sub_script_flag = False
        super_script_flag = False
        power_flag = False
        power_index = -1
        prompt_flag = False
        index = 0

        previous_char = u""
        second_previous_char = u""
        output = u""
        next_char = u""

        allow_powers = kwargs.pop('allow_powers', False)
        allow_underlines = kwargs.pop('allow_underlines', False)
        allow_parens = kwargs.pop('allow_parens', False)
        allow_newlines = kwargs.pop('allow_newlines', False)

        # If powers are allowed, see if there's a power in this question
        # If so, then start the question in power
        if allow_powers:
            power_index = line.find(u"(*)")
            if power_index > -1:
                power_flag = True
                output += u"<strong>"

        while index < len(line):
            c = line[index]
            if index < len(line) - 1:
                next_char = line[index + 1]
            else:
                next_char = ""

            if index >= power_index and power_flag:
                power_flag = False
                output += u"(*)</strong>"
                index += 3  # Skip over the rest of what's in the power mark
                continue

            if c == u"~":
                if not italics_flag:
                    output += u"<i>"
                    italics_flag = True
                else:
                    output += u"</i>"
                    italics_flag = False
            elif c == u"(" and allow_parens and previous_char != u"\\":
                if italics_flag:
                    need_to_restore_italics_flag = True
                    italics_flag = False
                    output += u"</i>"

                if not power_flag:
                    output += u"<strong>("
                    parens_flag = True
                else:
                    output += u"("
            elif c == u"(" and allow_parens and previous_char == u"\\" and second_previous_char != u"\\":
                output = output[:-1]  # Get rid of the escape character
                output += c
            elif c == u")" and allow_parens and previous_char != u"\\" and second_previous_char != u"\\":
                if not power_flag:
                    output += u")</strong>"
                    parens_flag = False
                else:
                    output += u")"

                if need_to_restore_italics_flag:
                    output += u"<i>"
                    italics_flag = True
                    need_to_restore_italics_flag = False

            elif c == u")" and allow_parens and previous_char == u"\\":
                output = output[:-1]  # Get rid of the escape character
                output += c
            elif c == u"s" and previous_char == u"\\" and second_previous_char != u"\\" and not super_script_flag:
                output = output[:-1]  # Get rid of the escape character
                if sub_script_flag:
                    sub_script_flag = False
                    output += u"</sub>"
                else:
                    sub_script_flag = True
                    output += u"<sub>"
            elif c == u"S" and previous_char == u"\\" and second_previous_char != u"\\" and not sub_script_flag:
                output = output[:-1]  # Get rid of the escape character
                if super_script_flag:
                    super_script_flag = False
                    output += u"</sup>"
                else:
                    super_script_flag = True
                    output += u"<sup>"
            else:
                if c == u"_" and allow_underlines:
                    if next_char == u"_":
                        # This is a prompt
                        if not prompt_flag:
                            output += u"<u>"
                            prompt_flag = True
                        else:
                            output += u"</u>"
                            prompt_flag = False

                        index += 1  # Skip ahead so we don't re-process this character
                    else:
                        # This is a regular answer line
                        if not underline_flag:
                            output += u"<u><b>"
                            underline_flag = True
                        else:
                            output += u"</b></u>"
                            underline_flag = False
                else:
                    output += c
            second_previous_char = previous_char
            previous_char = c
            index += 1

        if italics_flag:
            output += u"</i>"

        if underline_flag:
            output += u"</b></u>"

        if parens_flag:
            output += u"</strong>"

        if power_flag:
            output += u"</strong>"

        if prompt_flag:
            output += u"</u>"

        if allow_newlines:
            output = output.replace(u"&lt;br&gt;", u"<br />")

        return output

    def get_character_count(self, line, ignore_pronunciation=True):

        if not ignore_pronunciation:
            return len(line)

        count = 0
        parens_flag = False  # Parentheses indicate pronunciation guide
        previous_char = ""
        for c in line:
            if parens_flag:
                if c == ")" and previous_char != "\\":
                    parens_flag = False
            else:
                if c == "(" and previous_char != "\\":
                    parens_flag = True
                elif c != "~" and not (previous_char == "\\" and (c == ")" or c == "(")):
                    count += 1  # Only count non-special chars not in pronunciation guide
            previous_char = c

        return count

    def are_special_characters_balanced(self, line):
        underline_flag = False
        italics_flag = False
        parens_flag = False
        previous_char = ""
        for c in line:
            if c == '_':
                if underline_flag:
                    underline_flag = False
                else:
                    underline_flag = True
            elif c == '~':
                if italics_flag:
                    italics_flag = False
                else:
                    italics_flag = True
            elif c == '(' and previous_char != "\\":
                if parens_flag:
                    # There are too many open parens
                    return False
                else:
                    parens_flag = True
            elif c == ')' and previous_char != "\\":
                if parens_flag:
                    parens_flag = False
                else:
                    # There are too many close parens
                    return False
            previous_char = c

        if underline_flag or italics_flag or parens_flag:
            return False
        else:
            return True

    @staticmethod
    def does_answerline_have_underlines(line):

        return '_' in line

    @staticmethod
    def strip_special_chars(line):

        return line.replace('_', '').replace('~', '')

    @staticmethod
    def strip_unicode(line):
        if isinstance(line, str):
            # line is not a unicode string, and normalizing it will throw
            return line
        if line is None or line.strip() == '':
            return ''
        return ''.join(c for c in unicodedata.normalize('NFKD', line)
                       if unicodedata.category(c) != 'Mn')

    @staticmethod
    def strip_answer_from_answer_line(line):

        if line:
            line = line.replace("ANSWER: ", "")

        return line


class TossupFormatterMixin(FormatterMixin):

    ACF_STYLE_TOSSUP = 'ACF-style tossup'

    def get_formatted_question_html(self, line, **kwargs):

        return super(TossupFormatterMixin, self).get_formatted_question_html(
            self.tossup_text, **kwargs)

    def get_tossup_type_from_question_type(self, question_type):
        if question_type is None or str(question_type) == '':
            return self.ACF_STYLE_TOSSUP
        else:
            return self.ACF_STYLE_TOSSUP


class BonusFormattedMixin(FormatterMixin):

    ACF_STYLE_BONUS = 'ACF-style bonus'
    VHSL_BONUS = 'VHSL bonus'

    def get_formatted_question_html_for_bonus_answers(self, bonus, **kwargs):

        return self.get_formatted_question_html(bonus.part1_answer[0:80], **kwargs) + \
               '<br />' + self.get_formatted_question_html(bonus.part2_answer[0:80], **kwargs) + \
               '<br />' + self.get_formatted_question_html(bonus.part3_answer[0:80], **kwargs) + '<br />'

    def get_bonus_type_from_question_type(self, question_type):
        if question_type is None or str(question_type) == '':
            return self.ACF_STYLE_BONUS
        elif str(question_type) == self.VHSL_BONUS:
            return self.VHSL_BONUS
        else:
            return self.ACF_STYLE_BONUS

