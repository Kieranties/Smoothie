/**
 * User: Kieranties
 * Date: 11/08/13
 */

describe('The format module', function(){
    var format;

    beforeEach(function(){
        //load modules
        module('format');

        //inject services
        inject(function(Format){
           format = Format;
        });
    })

    it('should expose dimText() which wraps text in <dim> tags', function(){
        expect(format.dimText('dimmed')).toBe('<dim>dimmed</dim>');
    });

    it('should expose matchText() which wraps text in <match> tags', function(){
        expect(format.matchText('matched')).toBe('<match>matched</match>');
    });

    it('should expose urlText() which wraps text in <url> tags', function(){
        expect(format.urlText('urled')).toBe('<url>urled</url>');
    });

    it('should allow dim/match/url methods to be wrapped', function(){
        expect(format.urlText(format.matchText(format.dimText('all the things'))))
            .toBe('<url><match><dim>all the things</dim></match></url>');
    });

    it('should expose priorityString() which returns a number as a priority description', function(){
        expect(format.priorityString(1)).toBe('1 - High');
        expect(format.priorityString(2)).toBe('2 - Medium');
        expect(format.priorityString(3)).toBe('3 - Low');
        expect(format.priorityString(5)).toBe('None');
        expect(format.priorityString(0)).toBe('None');
        expect(format.priorityString('a string')).toBe('None');
        expect(format.priorityString({})).toBe('None');
        expect(format.priorityString(new Date())).toBe('None');
        expect(format.priorityString(Math.random())).toBe('None');
    })

    describe('should define getDayName', function(){
        it('as a method on the Date object', function(){
            expect(Date.prototype.getDayName).toBeDefined();
        });

        it('and when called returns the full day name', function(){
            expect((new Date(2012, 11, 31)).getDayName()).toBe('Monday');
            expect((new Date(2013,0, 1)).getDayName()).toBe('Tuesday');
            expect((new Date(2013,0, 2)).getDayName()).toBe('Wednesday');
            expect((new Date(2013,0, 3)).getDayName()).toBe('Thursday');
            expect((new Date(2013,0, 4)).getDayName()).toBe('Friday');
            expect((new Date(2013,0, 5)).getDayName()).toBe('Saturday');
            expect((new Date(2013,0, 6)).getDayName()).toBe('Sunday');

            var today = new Date();
            var todayStr = today + '';
            var dayPart = todayStr.substr(0, todayStr.indexOf(' '));
            expect(today.getDayName()).toContain(dayPart);
        });
    });
});