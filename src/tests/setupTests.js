// enzyme to work with the enzyme adapter which only imports the necessary library for React 16
import DotEnv from 'dotenv';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import $ from 'jquery';

DotEnv.config({path:'.env.test'});
global.$=global.jQuery=$;

Enzyme.configure({
    adapter: new Adapter()
});

