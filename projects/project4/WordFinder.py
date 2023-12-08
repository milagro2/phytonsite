import os

def extract_alias_value_pairs(lines):
    alias_value_pairs = []
    alias = None
    contract = None

    for line in lines:
        line = line.replace('"', '')
        parts = line.split(':')
        if 'alias' in parts[0]:
            alias = parts[1].strip().strip(', ')
        elif 'value' in parts[0] and alias:
            value = parts[1].strip().strip(', ')
            alias_value_pairs.append((alias, value, contract))
            alias = None
        elif 'contract' in parts[0]:
            contract = parts[1].strip().strip(', ')

    return alias_value_pairs

folder_path = "projects/project4/TestFiles"
file_list = os.listdir(folder_path)

for file_name in file_list:
    file_path = os.path.join(folder_path, file_name)

    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            lines = file.readlines()

            alias_value_pairs = extract_alias_value_pairs(lines)

            if alias_value_pairs:
                print(f"\n- - - - - Alias and Value in {file_name}: - - - - -")

                error_found = False  # Initialize error flag

                for alias, value, contract in alias_value_pairs:
                    print(f'alias: {alias} -  value: {value} -  contract: {contract} - ', end=' ')

                    if contract == 'CurrentObjectBindContract':
                        if alias != 'node':
                            print("|>|>|> alias should be 'node' <|<|<|")
                            error_found = True
                    elif contract == 'ManagerBindContract':
                        if alias != 'manager':
                            print("|>|>|> alias should be 'manager' <|<|<|")
                            error_found = True
                    elif contract == 'LoggerBindContract':
                        if alias != 'logger':
                            print("|>|>|> alias should be 'logger' <|<|<|")
                            error_found = True
                    elif contract == 'WebUiContextBind':
                        if alias != 'webUI':
                            print("|>|>|> alias should be 'webUI' <|<|<|")
                            error_found = True
                    else:
                        if alias != value:
                            print("|>|>|> alias and value are not the same <|<|<|")
                            error_found = True

                if not error_found:
                    print("alias and value are correct (:")
                else:
                    print("alias and value are not correct everywhere")

print("\nCheck complete.")
