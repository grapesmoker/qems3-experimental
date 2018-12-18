class InvalidTossup(Exception):

    def __init__(self, *args):
        self.args = [a for a in args]

    def __str__(self):
        s = '*' * 50 + '<br />'
        s += 'Invalid tossup {0}!<br />'.format(self.args[2])
        s += 'The problem is in field: {0}, which has value: {1}<br />'.format(self.args[0], self.args[1])
        s += '*' * 50 + '<br />'

        return s
