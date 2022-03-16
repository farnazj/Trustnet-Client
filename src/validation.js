import { extend } from 'vee-validate';
import { required } from "vee-validate/dist/rules";

extend("required", {
    validate (value) {
        return {
          required: true,
          valid: ['', null, undefined].indexOf(value) === -1
        };
      },
    computesRequired: true,
    message: 'Please assess the accuracy of the content'
});

extend('reasoningRule', {
    validate(value, args) {
        if (args.username == 'Trending' || args.selectValue - 2 == 0 )
            return true;
        else {
          let processedVal = value.trim();
          return ['', null, undefined].indexOf(processedVal) === -1;
        }
      },
      computesRequired: true,
      params: ['selectValue', 'username'],
      message: 'You should add your reasoning'
});

extend('articleUrl', {
    validate (value) {
        return {
          required: true,
          valid: ['', null, undefined].indexOf(value) === -1
        };
      },
    computesRequired: true,
    message: 'URL is required'
});
