
export default {
    methods: {
        rating(number) {
            if (!number) return '';
            if (number.toString().length <= 1) {
                return `${number.toString()}.0`;
            }
            return number.toString();
        },

        numberWithCommas(number) {
            if (!number) return '';
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        numberWithDoubleDigits(number) {
            if (number < 10) {
                return `0${number}`;
            }
            return number;
        },

        formatRuntime(minutes) {
            if (!minutes) return '';
            const seconds = minutes * 60;
            let secondsLeft = seconds;

            const hours = Math.floor(secondsLeft / 3600);
            secondsLeft = secondsLeft % 3600;

            const mins = Math.floor(secondsLeft / 60);
            secondsLeft = secondsLeft % 60;

            return `${hours ? hours + 'h' : ''} ${mins}min`;
        },

        truncate(text, length, clamp) {
            text = text || '';
            clamp = clamp || '...';
            length = length || 30;

            if (text.length <= length) return text;

            let tcText = text.slice(0, length - clamp.length);
            let last = tcText.length - 1;

            while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

            last = last || length - clamp.length;

            tcText = tcText.slice(0, last);

            return tcText + clamp;
        },

        arrayToList(array) {
            if (!array) return '';
            return array.map(item => item.name).join(', ');
        },

        fullDate(string) {
            if (!string) return '';
            const dateArray = string.split('-');
            const date = dateArray[2].substr(0, 1) === '0' ? dateArray[2].substr(1, 1) : dateArray[2];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            return `${date} ${months[dateArray[1] - 1]} ${dateArray[0]}`;
        },

        // Note: fullLang requires 'languages' from api. Handling simplified version or ignoring for now to avoid dependency cycle if not critical.
        fullLang(iso) {
            return iso;
        }
    }
};
