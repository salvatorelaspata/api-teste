# compute_input.py
import sys
import json
import numpy as np
from psd_tools import PSDImage

# Read data from stdin


def read_in():
    # lines = sys.stdin.readlines()
    # return json.loads(lines[0])
    # return sys.argv[1]
    return [sys.argv[1]]


def main():
    lines = read_in()
    img_directory = lines[0]

    psd = PSDImage.open(img_directory)

    layer_string = '{ \"components\": ['

    for component in psd:
        layer_string += '{ \"nome\": \"' + component.name + '\"'
        if hasattr(component, '_layers'):
            layer_string += ',' + ' \"colors\": ['
            for color in component._layers[:-1]:
                layer_string += '{ \"color\": \"' + color.name + '\" }' + ','
            else:
                layer_string += '{ \"color\": \"' + \
                    component._layers[-1].name + '\" }'

            layer_string += ']'

        layer_string += '}' + ','
    # else:
    #     layer_string += '}'
    layer_string = layer_string[:-1]
    layer_string += ']}'
    print(layer_string)


# start process
if __name__ == '__main__':
    main()

    # layer_string = '{ \"components\": [\n'

    # for component in psd:
    #     layer_string += '\t{ \"nome\": \"' + component.name + '\"'
    #     if hasattr(component, '_layers'):
    #         layer_string += ',' + '\n\t \"child\": [\n'
    #         for color in component._layers:
    #             layer_string += '\t\t{ \"color\": \"' + \
    #                 color.name + '\" }\n' + ','
    #         layer_string += '\t\t]\n'

    #     layer_string += '}\n' + ','

    # layer_string += '}\n'
