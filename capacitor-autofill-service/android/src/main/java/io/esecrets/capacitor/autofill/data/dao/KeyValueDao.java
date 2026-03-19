package io.esecrets.capacitor.autofill.data.dao;

import java.util.Optional;

public interface KeyValueDao {
  Optional<String> get(String key);
  void set(String key, String val);
  void deleteKey(String key);
}
